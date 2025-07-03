import { Head } from '@inertiajs/react';
import AuthSimpleHeaderLayout from '@/layouts/auth/auth-simple-header-layout';
import { Button } from '@/components/ui/button';

export default function Success({ message }: { message: string }) {
    return (
        <AuthSimpleHeaderLayout
            title="Agendamento Concluído"
            description="Obrigado por realizar seu agendamento."
        >
            <Head title="Agendamento Concluído" />

            <div className="space-y-6 p-4 border rounded-md shadow-sm text-center">
                <h2 className="text-2xl font-bold text-green-600">{message}</h2>
                <p className="text-gray-600">
                    Verifique seu email para mais detalhes. Caso tenha dúvidas, entre em contato conosco.
                </p>
                <Button onClick={() => (window.location.href = '/')}>
                    Voltar para a Página Inicial
                </Button>
            </div>
        </AuthSimpleHeaderLayout>
    );
}
