import { Head, router, useForm } from '@inertiajs/react';
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
import { User } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuários', href: '/users' },
    { title: 'Editar Usuário', href: '#' },
];

type EditForm = {
    id: number;
    area_id: number;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    image?: File;
    roles: number[];
    _method: 'PUT';
};

interface Props {
    roles: OptionType[];
    areas: OptionType[];
    user: User;
}

export default function UserEdit({ roles, areas, user }: Props) {
    const { data, setData, post, processing, errors } = useForm<EditForm>({
        _method: 'PUT',
        id: user.id,
        area_id: user.area_id,
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        image: undefined,
        roles: user.roles ? user.roles.map((role) => Number(role.id)) : [],
    });

    const [selectedImage, setSelectedImage] = useState<string | undefined>(user.image_path || undefined);
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const selectedRoleOptions = roles.filter(role => data.roles.includes(Number(role.value)));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Usamos post para enviar arquivos, mas o Laravel tratará como PUT por causa do _method.
        console.log(route('users.update', user.id));
        post(route('users.update', user.id), {


            onSuccess: () => {
                toast("Sucesso", { description: "Usuário atualizado com sucesso!" });
            },
        });
    };

    const handleFileClick = () => {
        hiddenFileInput.current?.click();
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
            <Head title="Editar Usuário" />

            <div className="px-4 py-6">
                <Heading
                    title="Editar Usuário"
                    description="Atualize os dados do usuário no sistema"
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
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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

                            {/* Nome e E-mail */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome <span className="text-red-600">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="Digite o nome completo"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail <span className="text-red-600">*</span></Label>
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
                                    <Label htmlFor="password">Nova Senha (opcional)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Deixe em branco para não alterar"
                                        value={data.password || ''}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirmação da Nova Senha</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirme a nova senha"
                                        value={data.password_confirmation || ''}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            {/* Perfis e Área */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="roles">Perfis <span className="text-red-600">*</span></Label>
                                    <SelectMulti
                                        id="roles"
                                        options={roles}
                                        value={selectedRoleOptions}
                                        onChange={(selectedOptions) => {
                                            setData("roles", selectedOptions.map(option => Number(option.value)));
                                        }}
                                        placeholder="Selecione os perfis"
                                    />
                                    <InputError message={errors.roles} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="area_id">Área</Label>
                                    <Select onValueChange={(value) => setData('area_id', Number(value))} value={String(data.area_id)} >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areas.map((area) => (
                                                <SelectItem key={area.value} value={String(area.value)}>{area.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.area_id} className="mt-2" />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <a href={route('users.index')}>← Voltar</a>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}