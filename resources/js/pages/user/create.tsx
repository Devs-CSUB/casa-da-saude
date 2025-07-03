import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import { BreadcrumbItem } from "@/types";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Edit2 } from 'lucide-react';
import SelectMulti from '@/components/select-multi';

import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { OptionType } from "@/types/select";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuários', href: '/users' },
    { title: 'Novo Usuário', href: '#' },
];

type FormType = {
    area_id: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    image: File | undefined;
    roles: number[];
    areas: number[];
};


type Area = {
    id: number;
    name: string;
};

interface Props {
    roles: OptionType[];
    areas: Area[];
}

export default function UserCreate({ roles, areas }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormType>({
        area_id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: undefined,
        roles: [],
        areas: [],
    });

    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                toast("Sucesso", { description: "Usuário criado com sucesso!" });
                reset(); // Reseta os dados do formulário.
            },
        });
    };

    const handleFileClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setData('image', file);

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo Usuário" />

            <div className="px-4 py-6">
                <Heading
                    title="Novo Usuário"
                    description="Cadastre um novo usuário no sistema"
                />

                <Card className="w-full mx-auto shadow-md">
                    <form onSubmit={submit}>
                        <CardContent className="flex flex-col gap-6">
                            {/* Foto do Usuário */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Imagem</Label>
                                <div className="relative w-24">
                                    <Avatar className="size-20">
                                        <AvatarImage src={selectedImage} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>

                                    <button
                                        type="button"
                                        onClick={handleFileClick}
                                        className="absolute bottom-0 right-0 p-1 mr-5 bg-primary flex items-center size-6 text-white hover:bg-foreground rounded-full"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                                <Input
                                    id="image"
                                    type="file"
                                    ref={hiddenFileInput}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <InputError message={errors.image} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Nome <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Digite o nome completo"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* E-mail */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        E-mail <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Digite o e-mail"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>


                            {/* Senha e Confirmação */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Senha <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Digite a senha"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirmação da Senha <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirme a senha"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            {/* Perfis */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="roles">
                                        Perfis <span className="text-red-600">*</span>
                                    </Label>
                                    <SelectMulti
                                        id="roles"
                                        options={roles}
                                        value={roles.filter((role) => data.roles.includes(role.value))}
                                        onChange={(selected) =>
                                            setData("roles", selected.map((option: OptionType) => option.value))
                                        }
                                        placeholder="Selecione os perfis"
                                        isClearable={true}
                                        isSearchable={true}
                                    />
                                    <InputError message={errors.roles} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="area_id">
                                        Área
                                    </Label>
                                    <select
                                        id="area_id"
                                        value={data.area_id}
                                        onChange={(e) => setData("area_id", e.target.value)}
                                        className="p-2 border rounded-md"
                                        disabled={processing}
                                    >
                                        <option value="">Selecione uma área</option>
                                        {areas.map((area) => (
                                            <option key={area.id} value={String(area.id)}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.area_id} className="mt-2" />
                                </div>
                            </div>

                        </CardContent>

                        {/* Ações */}
                        <CardFooter className="flex justify-between gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <a href={route('users.index')}>← Voltar</a>
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
