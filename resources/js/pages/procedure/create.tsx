import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { BreadcrumbItem } from "@/types";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Procedimentos',
        href: '/procedures',
    },
    {
        title: 'Novo Procedimento',
        href: '#',
    },
];

type Category = {
    id: number;
    name: string;
};

type CreateProcedureForm = {
    category_id: string;
    name: string;
    description: string;
    duration: string;
    price: string;
    is_active: boolean;
};

type Props = {
    categories: Category[];
};

export default function ProcedureCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<CreateProcedureForm>({
        category_id: '',
        name: '',
        description: '',
        duration: '',
        price: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('procedures.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Novo Procedimento" />

            <div className="px-4 py-6">
                <Heading title="Novo Procedimentos" description="Cadastre um novo procedimento no sistema" />

                <Card className="w-full mx-auto shadow-md">
                    <form onSubmit={submit}>
                        <CardContent className="flex flex-col gap-6">
                        {/* Categoria */}
                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Categoria <span className="text-red-600">*</span></Label>
                            <Select
                            value={data.category_id}
                            onValueChange={(value) => setData('category_id', value)}
                            >
                            <SelectTrigger id="category_id" disabled={processing}>
                                <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} className="mt-2" />
                        </div>

                        {/* Nome */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome <span className="text-red-600">*</span></Label>
                            <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Descrição */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição <span className="text-red-600">*</span></Label>
                            <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Duração e Preço */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                            <Label htmlFor="duration">Duração (min) <span className="text-red-600">*</span></Label>
                            <Input
                                id="duration"
                                type="number"
                                value={data.duration}
                                onChange={(e) => setData('duration', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.duration} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                            <Label htmlFor="price">Preço (R$) <span className="text-red-600">*</span></Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.price} className="mt-2" />
                            </div>
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

                        <CardFooter className="flex justify-between gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <a href={route('procedures.index')}>← Voltar</a>
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
