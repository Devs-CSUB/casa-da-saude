<?php

namespace App\Http\Controllers;

use App\Http\Resources\PatientResource;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sortField = $request->input('sortField', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $search = $request->input('search', '');

        $patients = Patient::query()
            ->when($search, function (Builder $query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('cpf', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%");
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate(15);

        return Inertia::render('patient/index', [
            'patients' => PatientResource::collection($patients),
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('patient/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'cpf' => 'required|string|max:14|unique:patients',
            'birth' => 'required|date',
            'phone' => 'required|string|max:15',
            'email' => 'required|email|max:255|unique:patients',
            'notes' => 'nullable|string',
            'is_active' => ['required', 'boolean'],
        ]);

        Patient::create($data);

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Paciente criado com sucesso!',
        ]);

        return redirect(route('patients.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        return Inertia::render('patient/show', [
            'patient' => $patient,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        return Inertia::render('patient/edit', [
            'patient' => $patient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'cpf' => "required|string|max:14|unique:patients,cpf,{$patient->id}",
            'birth' => 'required|date',
            'phone' => 'required|string|max:15',
            'email' => "required|email|max:255|unique:patients,email,{$patient->id}",
            'notes' => 'nullable|string',
            'is_active' => ['required', 'boolean'],
        ]);

        $patient->update($data);

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Paciente atualizado com sucesso!',
        ]);

        return redirect(route('patients.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Paciente excluído com sucesso!',
        ]);

        return back();
    }
}
