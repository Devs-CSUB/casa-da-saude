<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentTime;
use App\Helpers\FormatterHelper;
use App\Models\Appointment;
use App\Models\AppointmentItem;
use App\Models\Area;
use App\Models\Patient;
use App\Models\Procedure;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicAppointmentController extends Controller
{
    /**
     * Exibir todas as Áreas para o usuário selecionar.
     */
    public function selectArea()
    {
        $areas = Area::select('id', 'name')->get();

        return Inertia::render('public/appointment/select-area', [
            'areas' => $areas,
        ]);
    }

    /**
     * Filtrar e exibir Procedures da área selecionada.
     */
    public function selectProceduresByArea(Area $area)
    {

        $procedures = $area->procedures()
            ->where('is_active', true)
            ->select(
                'procedures.id',
                'procedures.name',
                'procedures.description',
                'procedures.price',
                'procedures.duration'
            )
            ->addSelect('categories.area_id as area_id')
            ->get();

        return Inertia::render('public/appointment/select-procedures', [
            'area' => $area,
            'procedures' => $procedures,
        ]);
    }

    /**
     * Adiciona as escolhas do Patient ao carrinho (session/cart).
     */
    public function addProceduresToCart(Request $request)
    {
        // Validação
        $data = $request->validate([
            'area_id' => 'required|exists:areas,id',
            'procedures' => 'required|array|min:1',
            'procedures.*' => 'exists:procedures,id',
        ]);

        // Armazenar no carrinho (sessão)
        $cart = [
            'area_id' => $data['area_id'],
            'procedures' => $data['procedures'],
        ];

        // dd($cart);

        session()->put('cart', $cart);

        return redirect()->route('public.appointment.select-datetime')->with('toast', [
            'type' => 'success',
            'message' => 'Procedimentos adicionados ao carrinho com sucesso!',
        ]);
    }

    /**
     * Exibir a seleção de data, profissional e horário.
     */
    public function selectDateTime()
    {
        $cart = session()->get('cart');

        // Verifica se o carrinho possui as informações necessárias
        if (! $cart || ! isset($cart['area_id']) || ! isset($cart['procedures'])) {
            return redirect()->route('public.appointment.select-area')->with('toast', [
                'type' => 'error',
                'message' => 'Você precisa selecionar uma área e procedimentos antes!',
            ]);
        }

        $area = Area::with('categories')->findOrFail($cart['area_id']);
        $procedures = Procedure::whereIn('id', $cart['procedures'])->get();
        $totalProcedureTime = $procedures->sum('duration');

        $professionals = User::professionals()
            ->where('area_id', $cart['area_id']) // Filtrar por área associada
            ->select(['id', 'name'])
            ->get();

        return Inertia::render('public/appointment/select-datetime', [
            'area' => $area,
            'procedures' => $procedures,
            'totalProcedureTime' => $totalProcedureTime,
            'professionals' => $professionals,
        ]);
    }

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'professional_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        $professionalId = $request->input('professional_id');
        $date = $request->input('date');

        $schedule = Schedule::where('professional_id', $professionalId)
            ->whereDate('date', $date)
            ->first();

        if (! $schedule) {
            return response()->json(['available_slots' => []]);
        }

        // Busca horários ocupados
        $availableTimes = $schedule->items()
            ->whereNull('appointment_item_id')
            ->pluck('appointment_time')
            ->toArray();

        return response()->json(['available_slots' => array_values($availableTimes)]);
    }

    /**
     * Adiciona informações de data e horário ao carrinho.
     */
    public function addDateTimeToCart(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'selectedTimes' => ['required', 'array'],
            'selectedTimes.*' => ['integer', 'in:'.implode(',', AppointmentTime::all())],
            'professional_id' => ['required', 'exists:users,id'],
        ]);

        $timeSlots = collect($validated['selectedTimes'])
            ->map(fn ($time) => AppointmentTime::from($time)->label())
            ->toArray();

        session()->put('cart.datetime', [
            'date' => $validated['date'],
            'times' => $timeSlots,
            'professional_id' => $validated['professional_id'],
        ]);

        return redirect()->route('public.appointment.patient-form');
    }

    /**
     * Exibir a página para capturar os dados do paciente.
     */
    public function showPatientForm()
    {
        $cart = session()->get('cart');
        if (! $cart || ! isset($cart['datetime'])) {
            return redirect()->route('public.appointment.select-area')->with('toast', [
                'type' => 'error',
                'message' => 'Por favor, selecione os procedimentos e horário antes de continuar.',
            ]);
        }

        return Inertia::render('public/appointment/patient-form');
    }

    /**
     * Finalizar o agendamento.
     */
    public function savePatient(Request $request)
    {
        $cart = session()->get('cart');

        if (! $cart || ! isset($cart['datetime'])) {
            return redirect()->route('public.appointment.select-area')->with('toast', [
                'type' => 'error',
                'message' => 'Por favor, selecione os procedimentos e horário antes de continuar.',
            ]);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'cpf' => 'required|string|max:14',
            'birth' => 'required|date',
            'phone' => 'required|string',
            'email' => 'required|email',
            'notes' => 'nullable|string',
        ]);

        $data['cpf'] = FormatterHelper::onlyNumbers($data['cpf']);
        $data['phone'] = FormatterHelper::onlyNumbers($data['phone']);

        /**
         * Buscar o paciente pelo CPF ou criar um novo registro.
         * Se já existir, atualizar os dados fornecidos.
         */
        $patient = Patient::updateOrCreate(
            ['cpf' => $data['cpf']],
            $data
        );

        session()->put('cart.patient_id', $patient->id);

        return redirect()->route('public.appointment.show-confirmation');
    }

    /**
     * Exibir o resumo do agendamento para confirmação.
     */
    public function showConfirmation()
    {
        $cart = session()->get('cart');

        if (! $cart || ! isset($cart['patient_id'])) {
            return redirect()->route('public.appointment.select-area')->with('toast', [
                'type' => 'error',
                'message' => 'Por favor, preencha os dados antes de continuar.',
            ]);
        }

        $area = Area::findOrFail($cart['area_id']);
        $procedures = Procedure::whereIn('id', $cart['procedures'])->get();
        $professional = User::findOrFail($cart['datetime']['professional_id']);
        $patient = Patient::findOrFail($cart['patient_id']);
        $total = $procedures->sum('price');

        return Inertia::render('public/appointment/show-confirmation', [
            'appointment' => [
                'area' => $area,
                'procedures' => $procedures,
                'professional' => $professional,
                'date' => $cart['datetime']['date'],
                'times' => $cart['datetime']['times'],
                'patient' => $patient,
                'total' => $total,
            ],
        ]);
    }

    public function completeAppointment()
    {
        $cart = session()->get('cart');

        if (! $cart || ! isset($cart['area_id'], $cart['procedures'], $cart['datetime'], $cart['patient_id'])) {
            return redirect()->route('public.appointment.select-area')->with('toast', [
                'type' => 'error',
                'message' => 'Por favor, complete o agendamento antes de finalizar.',
            ]);
        }

        try {
            // Recuperar dados principais do carrinho
            $patientId = $cart['patient_id'];
            $date = $cart['datetime']['date'];
            // $time = $cart['datetime']['time'];
            $professionalId = $cart['datetime']['professional_id'];
            $procedures = Procedure::whereIn('id', $cart['procedures'])->get();

            // Calcular o total do agendamento
            $total = $procedures->sum('price');

            // Criar o agendamento
            $appointment = Appointment::create([
                'patient_id' => $patientId,
                'date' => "$date",
                'total' => $total,
            ]);

            // Criar itens do agendamento para cada procedimento
            foreach ($procedures as $procedure) {
                AppointmentItem::create([
                    'appointment_id' => $appointment->id,
                    'procedure_id' => $procedure->id,
                    'professional_id' => $professionalId,
                    'value' => $procedure->price,
                ]);
            }

            session()->forget('cart');

            return redirect()->route('public.appointment.success')->with('toast', [
                'type' => 'success',
                'message' => 'Agendamento concluído com sucesso!',
            ]);
        } catch (\Exception $e) {
            // Em caso de erro, redireciona com uma mensagem
            return redirect()->route('public.appointment.select-area')->with('toast', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao completar o agendamento. Por favor, tente novamente.',
            ]);
        }
    }

    /**
     * Exibir o resumo do agendamento para confirmação.
     */
    public function success()
    {
        return Inertia::render('public/appointment/success', []);
    }
}
