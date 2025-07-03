import { Head, useForm } from '@inertiajs/react';
import AuthSimpleHeaderLayout from '@/layouts/auth/auth-simple-header-layout';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PatientForm() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        cpf: '',
        birth: '',
        phone: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('public.appointment.save-patient'));
    };

    return (
        <AuthSimpleHeaderLayout
            title="Informações do Paciente"
            description="Preencha os seus dados para concluir o agendamento."
        >
            <Head title="Informações do Paciente" />

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Nome */}
                <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* CPF */}
                <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                        id="cpf"
                        type="text"
                        value={data.cpf}
                        onChange={(e) => setData('cpf', e.target.value)}
                        disabled={processing}
                        required
                    />
                    <InputError message={errors.cpf} className="mt-2" />
                </div>

                {/* Data de Nascimento */}
                <div className="grid gap-2">
                    <Label htmlFor="birth">Data de Nascimento</Label>
                    <Input
                        id="birth"
                        type="date"
                        value={data.birth}
                        onChange={(e) => setData('birth', e.target.value)}
                        disabled={processing}
                        required
                    />
                    <InputError message={errors.birth} className="mt-2" />
                </div>

                {/* Telefone */}
                <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        disabled={processing}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Enviando...' : 'Continuar'}
                </Button>
            </form>
        </AuthSimpleHeaderLayout>
    );
}
