import { Head } from '@inertiajs/react';
import AuthSimpleHeaderLayout from '@/layouts/auth/auth-simple-header-layout';
import { Button } from '@/components/ui/button';
import { Area } from '@/types/models';

export default function SelectArea({ areas }: { areas: Area[] }) {
    return (
        <AuthSimpleHeaderLayout
            title="Selecione uma Área"
            description="Escolha a área para continuar com o agendamento dos seus procedimentos."
        >
            <Head title="Seleção de Área" />

            <div className="grid gap-6">
                {areas.map((area) => (
                    <div
                        key={area.id}
                        className="rounded-lg p-4 border shadow-sm flex justify-between items-center"
                    >
                        <span className="text-lg font-semibold">{area.name}</span>
                        <Button
                            onClick={() =>
                                window.location.href = route('public.appointment.select-procedures', area.id)
                            }
                        >
                            Selecionar
                        </Button>
                    </div>
                ))}
            </div>
        </AuthSimpleHeaderLayout>
    );
}
