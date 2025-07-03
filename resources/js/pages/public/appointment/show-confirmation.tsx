import { Head, router } from '@inertiajs/react';
import AuthSimpleHeaderLayout from '@/layouts/auth/auth-simple-header-layout';
import { Button } from '@/components/ui/button';

interface ConfirmationProps {
    appointment: {
        area: { name: string };
        procedures: { name: string; price: number }[];
        professional: { name: string };
        date: string;
        times: string[]; // Lista de horários
        patient: { name: string; phone: string; email: string };
        total: number;
    };
}

export default function ShowConfirmation({ appointment }: ConfirmationProps) {
    const handleConfirm = () => {
        router.get(route('public.appointment.complete'))
    };

    const formattedTimes = appointment.times.join(', ');

    return (
        <AuthSimpleHeaderLayout
            title="Confirmação do Agendamento"
            description="Confira os detalhes do agendamento antes de confirmar."
        >
            <Head title="Confirmação do Agendamento" />

            <div className="space-y-6 p-4 border rounded-md shadow-sm">
                {/* Dados do Atendimento */}
                <div>
                    <h2 className="font-semibold text-lg">Dados do Atendimento</h2>
                    <p>
                        <strong>Área:</strong> {appointment.area.name}
                    </p>
                    <p>
                        <strong>Profissional:</strong> {appointment.professional.name}
                    </p>
                    <p>
                        <strong>Data:</strong> {appointment.date}
                    </p>
                    <p>
                        <strong>Horários:</strong> {formattedTimes}
                    </p>
                </div>

                {/* Procedimentos */}
                <div>
                    <h2 className="font-semibold text-lg">Procedimentos</h2>
                    <ul>
                        {appointment.procedures.map((procedure, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{procedure.name}</span>
                                <span>R$ {procedure.price.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="font-bold mt-2">
                        Total: R$ {appointment.total.toFixed(2)}
                    </p>
                </div>

                {/* Dados do Paciente */}
                <div>
                    <h2 className="font-semibold text-lg">Dados do Paciente</h2>
                    <p>
                        <strong>Nome:</strong> {appointment.patient.name}
                    </p>
                    <p>
                        <strong>Telefone:</strong> {appointment.patient.phone}
                    </p>
                    <p>
                        <strong>Email:</strong> {appointment.patient.email}
                    </p>
                </div>

                {/* Botão de Confirmação */}
                <Button onClick={handleConfirm}>
                    Confirmar Agendamento
                </Button>
            </div>
        </AuthSimpleHeaderLayout>
    );
}
