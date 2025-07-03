<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProcedureRequest;
use App\Http\Requests\UpdateProcedureRequest;
use App\Http\Resources\ProcedureResource;
use App\Models\Category;
use App\Models\Procedure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProcedureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sortField = $request->input('sortField', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $search    = $request->input('search', '');

        $procedures = Procedure::with('category')
            ->when($search, function (Builder $query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate(15);

        return Inertia::render('procedure/index', [
            'procedures' => ProcedureResource::collection($procedures),
            'sortField'  => $sortField,
            'sortOrder'  => $sortOrder,
            'search'     => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('procedure/create', [
            'categories' => $categories,
        ]);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProcedureRequest $request)
    {
        $data = $request->validated();
        Procedure::create($data);

        session()->flash('toast', [
            'type'    => 'success',
            'message' => 'Procedimento criado com sucesso!',
        ]);

        return redirect(route('procedures.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Procedure $procedure)
    {
        $procedure->load('category');

        return Inertia::render('procedure/show', [
            'procedure' => new ProcedureResource($procedure),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Procedure $procedure)
    {

        $categories = Category::select('id', 'name')->get();

        return Inertia::render('procedure/edit', [
            'procedure'  => $procedure,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProcedureRequest $request, Procedure $procedure)
    {
        $data = $request->validated();
        $procedure->update($data);

        session()->flash('toast', [
            'type'    => 'success',
            'message' => 'Procedimento atualizado com sucesso!',
        ]);

        return redirect(route('procedures.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Procedure $procedure)
    {
        $procedure->delete();

        session()->flash('toast', [
            'type'    => 'success',
            'message' => 'Procedimento excluído com sucesso!',
        ]);

        return back();
    }
}
