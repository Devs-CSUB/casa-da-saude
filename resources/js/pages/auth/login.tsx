import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Acessar conta" />

            <div className="flex min-h-screen w-full bg-white">
                {/* Coluna da Esquerda (Apresentação) */}
                <div
                    className="relative hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 text-center text-white"
                    style={{
                        backgroundImage: "url('/assets/back-unibalsas.webp')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay escuro para melhor legibilidade */}
                    <div className="absolute inset-0 bg-black/70" />

                    <div className="relative z-10 flex flex-col items-center">
                        <AppLogo className="w-60 brightness-[10000%]" />
                        <h1 className="mt-8 text-4xl font-bold">Bem-vindo(a) de volta!</h1>
                        <p className="mt-4 text-lg text-gray-200">
                            Casa da Saúde UNIBALSAS - Conectando você ao cuidado.
                        </p>
                    </div>
                </div>

                {/* Coluna da Direita (Formulário) */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold tracking-tight">Acessar sua conta</h2>
                            <p className="text-muted-foreground mt-2">
                                Entre com seu e-mail e senha para continuar.
                            </p>
                        </div>

                        {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                        <form className="space-y-6" onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Endereço de e-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="seuemail@exemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                            Esqueceu sua senha?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Sua senha"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', !!checked)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="font-normal cursor-pointer">
                                    Lembrar de mim
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Entrar
                            </Button>
                        </form>

                        {canRegister && (
                            <p className="text-center text-sm text-muted-foreground">
                                Não tem uma conta?{' '}
                                <TextLink href={route('register')} tabIndex={6}>
                                    Cadastre-se
                                </TextLink>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}