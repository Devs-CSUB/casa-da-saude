<?php

namespace App\Http\Controllers;

use App\Http\Requests\{RoleStoreRequest, RoleUpdateRequest};
use App\Http\Resources\{ModuleResource, RoleResource};
use App\Models\ACL\{Module, Role};
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\{RedirectResponse, Request};
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        if ($request->user()->cannot('read_roles')) {
            abort(403);
        }

        $sortField = $request->input('sortField', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $search    = $request->input('search', '');

        $roles = Role::query()
        ->checkSupport()
        ->when($search, function (Builder $query) use ($search) {
            $query->whereLike('name', "%{$search}%");
        })
        ->orderBy($sortField, $sortOrder);

        $roles = $roles->paginate(15);

        return Inertia::render('Role/Index', [
            'roles'     => RoleResource::collection($roles),
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
            'search'    => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * @return \Inertia\Response
     */
    public function create()
    {
        $modules = Module::query()->with('permissions')->get();

        return Inertia::render('Role/Create', [
            'modules' => ModuleResource::collection($modules),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleStoreRequest $request): RedirectResponse
    {
        if ($request->user()->cannot('write_roles')) {
            abort(403);
        }

        $validated = $request->validated();

        $role = Role::create($validated);

        $role->permissions()->sync($validated['permissions']);

        return redirect(route('roles.index'));
    }

    /**
     * Display the specified resource.
     * @return \Inertia\Response
     */
    public function show(string $id)
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        if ($authUser->cannot('read_roles')) {
            abort(403);
        }

        $role = Role::query()->with(['permissions:id'])->findOrFail($id);

        $modules = Module::query()->with('permissions')->get();

        return Inertia::render('Role/Show', [
            'role'    => $role,
            'modules' => ModuleResource::collection($modules),
            'can'     => [
                'write_roles' => $authUser->can('write_roles'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * @return \Inertia\Response
     */
    public function edit(string $id)
    {
        $role = Role::query()->with(['permissions:id'])->findOrFail($id);

        $modules = Module::query()->with('permissions')->get();

        return Inertia::render('Role/Edit', [
            'role'    => $role,
            'modules' => ModuleResource::collection($modules),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request, Role $role): RedirectResponse
    {
        if ($request->user()->cannot('write_roles')) {
            abort(403);
        }

        $validated = $request->validated();

        $role->update($validated);

        $role->permissions()->sync($validated['permissions']);

        return redirect(route('roles.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        if ($authUser->cannot('write_roles')) {
            abort(403);
        }

        $role->delete();

        return back();
    }
}