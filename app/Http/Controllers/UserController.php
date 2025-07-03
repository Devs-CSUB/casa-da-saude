<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\ACL\Role;
use App\Models\Area;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    /** @return \Inertia\Response */
    public function index(Request $request)
    {
        if ($request->user()->cannot('read_users')) {
            abort(403);
        }

        $sortField = $request->input('sortField', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $search = $request->input('search', '');
        $trashed = $request->input('trashed', null);

        $users = User::query()
            ->with('area', 'roles')
            ->checkSupport()
            ->where(function (Builder $query) use ($search) {
                if ($search) {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('email', "%{$search}%");
                }
            })
            ->when($trashed, function (Builder $query) {
                $query->onlyTrashed();
            })
            ->orderBy($sortField, $sortOrder);

        $users = $users->paginate(15);

        /*$roles = Role::query()
            ->checkSupport()
            ->get()->map(function ($role) {
                return [
                    'value' => $role->id,
                    'label' => $role->name,
                ];
            });*/

        return Inertia::render('user/index', [
            'users' => UserResource::collection($users),
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
            'search' => $search,
            'trashed' => $trashed,
        ]);
    }

    public function create()
    {
        // $roles = Role::select('id', 'name')->get();
        $roles = Role::query()
            ->get()->map(function ($role) {
                return [
                    'value' => $role->id,
                    'label' => $role->name,
                ];
            });

        $areas = Area::query()->select('id', 'name')->get();

        return Inertia::render('user/create', [
            'roles' => $roles,
            'areas' => $areas,
        ]);
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        if ($request->user()->cannot('write_users')) {
            abort(403);
        }

        $validated = $request->validated();

        if ($request->has('image')) {
            $fileUrl = $request->file('image')->store('profile', 'public');
            $validated['image_path'] = $fileUrl;
        }

        $user = User::create($validated);

        $user->roles()->sync(array_column($validated['roles'], 'value'));

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Usuário criado com sucesso!',
        ]);

        return redirect(route('users.index'));
    }

    public function edit(User $user)
    {
        $user->load('roles');

        $roles = Role::query()->get()->map(function ($role) {
            return [
                'value' => $role->id,
                'label' => $role->name,
            ];
        });

        $areas = Area::query()->get()->map(function ($area) {
            return [
                'value' => $area->id,
                'label' => $area->name,
            ];
        });

        return Inertia::render('user/edit', [
            'user' => UserResource::make($user),
            'roles' => $roles,
            'areas' => $areas,
        ]);

    }

    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {

        if ($request->user()->cannot('write_users')) {
            abort(403);
        }

        $validated = $request->validated();

        if (array_key_exists('password', $validated) && empty($validated['password'])) {
            unset($validated['password']);

            if (isset($validated['password_confirmation'])) {
                unset($validated['password_confirmation']);
            }
        }

        if ($request->has('image')) {
            $disk = Storage::disk('public');

            if ($user->image_path && $disk->exists($user->image_path)) {
                $disk->delete($user->image_path);
            }

            $fileUrl = $request->file('image')->store('profile', 'public');
            $validated['image_path'] = $fileUrl;
        }

        $user->update($validated);

        $user->roles()->sync($validated['roles']);

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Usuário atualizado com sucesso!',
        ]);

        return redirect(route('users.index'));
    }

    public function destroy(User $user): RedirectResponse
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        if ($authUser->cannot('write_users')) {
            abort(403);
        }

        if ($authUser->id == $user->id) {
            abort(403);
        }

        if ($user->image_path) {
            Storage::disk('public')->delete($user->image_path);
        }

        $user->restored_at = null;
        $user->save();

        $user->delete();

        return back();
    }

    /**
     * Restore the specified resource
     */
    public function restore(int $id): RedirectResponse
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        if ($authUser->cannot('write_users')) {
            abort(403);
        }

        $user = User::withTrashed()->findOrFail($id);

        // Verifica se o usuário está excluído
        if ($user->trashed()) {
            $user->restore(); // Restaura o registro
            $user->restored_at = now();
            $user->save();
        }

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Usuário excluido com sucesso!',
        ]);

        return redirect(route('users.index'));
    }
}
