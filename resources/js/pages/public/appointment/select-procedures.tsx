import { Head, useForm } from '@inertiajs/react';
import AuthSimpleHeaderLayout from '@/layouts/auth/auth-simple-header-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Procedure } from '@/types/models';
import { cn } from '@/lib/utils';

export default function SelectProcedures({
    area,
    procedures,
}: {
    area: { id: number; name: string };
    procedures: Procedure[];
}) {
    const { data, setData, post } = useForm({
        area_id: area.id,
        procedures: [] as number[],
    });

    // Alternar seleção de procedimento
    const toggleProcedure = (id: number) => {
        setData(
            'procedures',
            data.procedures.includes(id)
                ? data.procedures.filter((procedureId) => procedureId !== id)
                : [...data.procedures, id]
        );
    };

    // Enviar formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('public.appointment.add-procedures-to-cart'));
    };

    return (
        <AuthSimpleHeaderLayout
            title={`Procedimentos em ${area.name}`}
            description="Selecione os procedimentos que deseja realizar. Cada procedimento possui uma duração estimada."
        >
            <Head title="Seleção de Procedimentos" />
            <form className="space-y-6" onSubmit={handleSubmit}>
                {procedures.map((procedure) => (
                    <div
                        key={procedure.id}
                        className={cn("flex items-center cursor-pointer justify-between p-4 border-2 rounded-lg shadow-sm", data.procedures.includes(procedure.id) ? "border-primary border-2" : "")}
                        onMouseDown={() => toggleProcedure(procedure.id)}

                    >
                        <div>
                            <p className="font-medium">{procedure.name}</p>
                            <p className="text-sm text-gray-500">{procedure.description}</p>
                            <p className="text-sm font-bold">R$ {procedure.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-400 italic">
                                Duração: {procedure.duration} minutos
                            </p>
                        </div>

                        <Checkbox
                            id={`procedure-${procedure.id}`}
                            checked={data.procedures.includes(procedure.id)}
                            onCheckedChange={() => toggleProcedure(procedure.id)}
                        />
                    </div>
                ))}

                {/* Botão de envio */}
                <Button type="submit" disabled={data.procedures.length === 0}>
                    Continuar
                </Button>
            </form>
        </AuthSimpleHeaderLayout>
    );
}
