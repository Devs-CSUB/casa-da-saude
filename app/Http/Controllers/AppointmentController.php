<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sortField = $request->input('sortField', 'date');
        $sortOrder = $request->input('sortOrder', 'desc');
        $search = $request->input('search', '');

        $appointments = Appointment::query()
            ->with('patient') // Eager load patient relationship
            ->when($search, function (Builder $query) use ($search) {
                $query->whereHas('patient', function (Builder $q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('cpf', 'LIKE', "%{$search}%");
                });
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate(15);

        return Inertia::render('appointment/index', [
            'appointments' => AppointmentResource::collection($appointments),
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
            'search' => $search,
        ]);
    }

    public function changeStatus(Request $request, Appointment $appointment)
    {
        $data = $request->validate([
            'status' => 'required',
        ]);

        $appointment->update($data);

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Status alterado com sucesso!',
        ]);

        return redirect(route('appointments.index'));

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('appointment/create', [
            'patients' => Patient::orderBy('name')->get(['id', 'name']),
            'statuses' => AppointmentStatus::toArray(),
            // Você também pode passar uma lista de procedimentos/serviços aqui
            // 'procedures' => Procedure::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'date' => 'required|date',
            'total' => 'required|numeric|min:0',
            'status' => ['required', Rule::enum(AppointmentStatus::class)],
            // Adicione a validação para os itens do agendamento aqui
            // 'items' => 'required|array',
            // 'items.*.procedure_id' => 'required|exists:procedures,id',
        ]);

        // Lógica para criar o agendamento e seus itens (idealmente dentro de uma transaction)
        $appointment = Appointment::create($data);

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Agendamento criado com sucesso!',
        ]);

        return redirect(route('appointments.index'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        $appointment->load('patient', 'items'); // Carrega as relações

        return Inertia::render('appointment/edit', [
            'appointment' => new AppointmentResource($appointment),
            'patients' => Patient::orderBy('name')->get(['id', 'name']),
            'statuses' => AppointmentStatus::toArray(),
            // 'procedures' => Procedure::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        $data = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'date' => 'required|date',
            'total' => 'required|numeric|min:0',
            'status' => ['required', Rule::enum(AppointmentStatus::class)],
        ]);

        $appointment->update($data);

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Agendamento atualizado com sucesso!',
        ]);

        return redirect(route('appointments.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Agendamento excluído com sucesso!',
        ]);

        return back();
    }
}
