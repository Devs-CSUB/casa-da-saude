import FullWidthHeaderLayout from "@/layouts/auth/full-width-header-layout";
import { Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <FullWidthHeaderLayout>
            {/* Banner Principal */}
            <div
                className="relative bg-cover bg-center h-[550px] w-full"
                style={{
                    backgroundImage: 'url("/assets/casa-da-saude-banner.webp")',
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative flex flex-col justify-center items-center h-full text-white text-center px-4">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                        Beleza e Saúde começam aqui! <br /> Estética e Odontologia com cuidado e confiança.
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl">
                        Descubra tratamentos personalizados para realçar sua beleza e cuidar do seu sorriso. <br />
                        Agende seus procedimentos de forma simples, prática e moderna.
                    </p>
                    <Link
                        href={route('public.appointment.select-area')}
                        className="mt-6 px-6 py-3 bg-primary rounded-lg text-primary-foreground font-medium shadow hover:bg-opacity-90 transition"
                    >
                        Agende seu atendimento
                    </Link>
                </div>
            </div>

            {/* Seção Quem Somos */}
            <div className="my-16 px-4 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                <div>
                    <img
                        src="/assets/clinica-escola-estetica.jpg"
                        alt="Quem Somos"
                        className="rounded-lg shadow-lg"
                    />
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 dark:text-white">
                        Quem Somos
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed text-justify dark:text-white">
                        A <strong>Casa da Saúde do UNIBALSAS</strong> é um espaço dedicado a conectar pessoas ao cuidado com a saúde de forma prática e eficiente.
                        Nosso sistema foi desenvolvido para transformar a maneira como os pacientes interagem com os serviços de Estética e Odontologia, oferecendo uma plataforma intuitiva e fácil de usar para agendamento de consultas e procedimentos.
                    </p>
                    <p className="mt-4 text-muted-foreground text-lg leading-relaxed text-justify dark:text-white">
                        Com foco em acessibilidade, modernidade e excelência no atendimento, nossa solução atende tanto a comunidade acadêmica quanto à população de Balsas, encurtando a distância entre você e o cuidado que merece. Aqui, promovemos mais do que serviços — entregamos confiança, comodidade e uma experiência focada em você.
                    </p>
                </div>
            </div>

            {/* Seção de Serviços */}
            {/* 
            <div className="my-16 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-primary">
                    Nossos Serviços
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-lg transition">
                        <img
                            src="/images/consulta-medica.jpg"
                            alt="Consulta Médica"
                            className="w-24 h-24 mb-4"
                        />
                        <h3 className="text-lg font-semibold text-primary">Consulta Médica</h3>
                        <p className="mt-2 text-muted-foreground">
                            Atendimento de qualidade com especialistas.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-lg transition">
                        <img
                            src="/images/exames-laboratoriais.jpg"
                            alt="Exames Laboratoriais"
                            className="w-24 h-24 mb-4"
                        />
                        <h3 className="text-lg font-semibold text-primary">
                            Exames Laboratoriais
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Resultados rápidos e precisos.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-lg transition">
                        <img
                            src="/images/vacinacao.jpg"
                            alt="Vacinação"
                            className="w-24 h-24 mb-4"
                        />
                        <h3 className="text-lg font-semibold text-primary">Vacinação</h3>
                        <p className="mt-2 text-muted-foreground">
                            Proteja sua saúde e da sua família.
                        </p>
                    </div>
                </div>
            </div>

            */}

            {/* Footer */}
            <div className="bg-primary dark:bg-black py-8 text-white text-center">
                <p className="text-sm sm:text-base">
                    © {new Date().getFullYear()} Casa da Saúde. Todos os direitos reservados.
                </p>
            </div>
        </FullWidthHeaderLayout>
    );
}
