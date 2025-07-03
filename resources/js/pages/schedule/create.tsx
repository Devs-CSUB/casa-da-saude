import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

import { BreadcrumbItem } from "@/types";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { AppointmentTimeEnumLabels } from "@/types/appointment-time";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Agendas",
        href: "/schedules",
    },
    {
        title: "Nova Agenda",
        href: "#",
    },
];

type CreateScheduleForm = {
    professional_id: string;
    startDate: string;
    endDate: string;
    is_active: boolean;
    selectedTimes: number[];
};

type Professional = {
    id: number;
    name: string;
};

type Props = {
    professionals: Professional[];
};

export default function ScheduleCreate({ professionals }: Props) {
    const { data, setData, post, processing, errors } = useForm<CreateScheduleForm>({
        professional_id: "",
        startDate: "",
        endDate: "",
        is_active: true,
        selectedTimes: [] as number[],
    });

    const handleCheckboxChange = (value: number) => {
        const updatedSelectedTimes = data.selectedTimes.includes(value)
            ? data.selectedTimes.filter((time) => time !== value) 
            : [...data.selectedTimes, value];

        setData("selectedTimes", updatedSelectedTimes);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("schedules.store"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Agenda" />

            <div className="px-4 py-6">
                <Heading
                    title="Nova Agenda"
                    description="Cadastre uma nova agenda indicando o período e os horários selecionados."
                />

                <Card className="w-full mx-auto shadow-md">
                    <form onSubmit={submit}>
                        <CardContent className="flex flex-col gap-6">
                            {/* Profissional */}
                            <div className="grid gap-2">
                                <Label htmlFor="professional_id">
                                    Profissional <span className="text-red-600">*</span>
                                </Label>
                                <select
                                    id="professional_id"
                                    value={data.professional_id}
                                    onChange={(e) => setData("professional_id", e.target.value)}
                                    className="p-2 border rounded-md"
                                    disabled={processing}
                                >
                                    <option value="">Selecione um profissional</option>
                                    {professionals.map((professional) => (
                                        <option key={professional.id} value={String(professional.id)}>
                                            {professional.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.professional_id} className="mt-2" />
                            </div>

                            {/* Período */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">
                                        Data Inicial <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={data.startDate}
                                        onChange={(e) => setData("startDate", e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.startDate} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">
                                        Data Final <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={data.endDate}
                                        onChange={(e) => setData("endDate", e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.endDate} className="mt-2" />
                                </div>
                            </div>

                            {/* Horários */}
                            <div className="grid gap-2">
                                <Label>
                                    Horários Disponíveis <span className="text-red-600">*</span>
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                                    {Object.entries(AppointmentTimeEnumLabels).map(([key, label]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`time-${key}`}
                                                checked={data.selectedTimes.includes(Number(key))}
                                                onCheckedChange={() => handleCheckboxChange(Number(key))}
                                                disabled={processing}
                                            />
                                            <Label htmlFor={`time-${key}`}>{label}</Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.selectedTimes} className="mt-2" />
                            </div>

                            {/* Ativo */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData("is_active", Boolean(checked))}
                                    disabled={processing}
                                />
                                <Label htmlFor="is_active">Ativa?</Label>
                                <InputError message={errors.is_active} className="mt-2" />
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <a href={route("schedules.index")}>← Voltar</a>
                            </Button>

                            <Button type="submit" disabled={processing}>
                                {processing ? "Salvando..." : "Salvar"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
