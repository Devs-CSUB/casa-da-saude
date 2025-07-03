<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\ScheduleResource;
use App\Models\Schedule;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sortField = $request->input('sortField', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $search = $request->input('search', '');

        $schedules = Schedule::with('professional')
            ->when($search, function (Builder $query) use ($search) {
                $query->whereHas('professional', function (Builder $subQuery) use ($search) {
                    $subQuery->where('name', 'LIKE', "%{$search}%");
                })
                    ->orWhere('date', 'LIKE', "%{$search}%");
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate(15);

        return Inertia::render('schedule/index', [
            'schedules' => ScheduleResource::collection($schedules),
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
        $professionals = User::professionals()->select('id', 'name')->get();

        return Inertia::render('schedule/create', [
            'professionals' => $professionals,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleRequest $request)
    {
        $data = $request->validated();
        $period = CarbonPeriod::create($data['startDate'], $data['endDate']);

        foreach ($period as $date) {

            $schedule = Schedule::create([
                'professional_id' => $data['professional_id'],
                'date' => $date->format('Y-m-d'),
                'is_active' => $data['is_active'] ?? true,
            ]);

            foreach ($data['selectedTimes'] as $time) {
                $schedule->items()->create([
                    'appointment_time' => $time,
                ]);
            }
        }

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Agenda(s) criada(s) com sucesso!',
        ]);

        return redirect(route('schedules.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        $schedule->load(['professional', 'items']);

        return Inertia::render('schedule/show', [
            'schedule' => new ScheduleResource($schedule),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        // Usando o scope "professionals" para buscar somente profissionais.
        $professionals = User::professionals()->select('id', 'name')->get();

        return Inertia::render('schedule/edit', [
            'schedule' => $schedule,
            'professionals' => $professionals,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $data = $request->validated();
        $schedule->update($data);

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Agenda atualizada com sucesso!',
        ]);

        return redirect(route('schedules.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        session()->flash('flash', [
            'type' => 'success',
            'message' => 'Agenda excluída com sucesso!',
        ]);

        return back();
    }
}
