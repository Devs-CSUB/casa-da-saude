import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { BreadcrumbItem } from "@/types";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";

import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pacientes',
        href: '/patients',
    },
    {
        title: 'Novo Paciente',
        href: '#',
    },
];

type CreatePatientForm = {
    name: string;
    cpf: string;
    birth: string;
    phone: string;
    email: string;
    notes: string;
    is_active: boolean;
};

export default function PatientCreate() {
    const { data, setData, post, processing, errors } = useForm<CreatePatientForm>({
        name: '',
        cpf: '',
        birth: '',
        phone: '',
        email: '',
        notes: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('patients.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo Paciente" />

            <div className="px-4 py-6">
                <Heading
                    title="Novo Paciente"
                    description="Cadastre um novo paciente no sistema"
                />

                <Card className="w-full mx-auto shadow-md">
                    <form onSubmit={submit}>
                        <CardContent className="flex flex-col gap-6">
                            {/* Nome */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    Nome <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Digite o nome completo"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* CPF e Data de Nascimento */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cpf">
                                        CPF <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="cpf"
                                        placeholder="Digite o CPF"
                                        value={data.cpf}
                                        onChange={(e) => setData("cpf", e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.cpf} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birth">
                                        Data de Nascimento <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="birth"
                                        type="date"
                                        value={data.birth}
                                        onChange={(e) => setData("birth", e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.birth} className="mt-2" />
                                </div>
                            </div>

                            {/* Celular e E-mail */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">
                                        Celular <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder="Digite o celular"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        E-mail <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Digite o e-mail"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>

                            {/* Observações */}
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Observações</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Digite quaisquer observações adicionais (opcional)"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>
                            {/* Ativo */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                            disabled={processing}
                            />
                            <Label htmlFor="is_active">Ativo?</Label>
                            <InputError message={errors.is_active} className="mt-2" />
                        </div>
                        </CardContent>

                        {/* Ações */}
                        <CardFooter className="flex justify-between gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <a href={route('patients.index')}>← Voltar</a>
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
