import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthSimpleHeaderLayout from "@/layouts/auth/auth-simple-header-layout";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AppointmentTimeEnumLabels,
    AppointmentTimeEnumOptions,
} from "@/types/appointment-time";
import axios from "@/utils/axios";

interface Professional {
    id: number;
    name: string;
}

export default function SelectDatetime({
    professionals,
}: {
    professionals: Professional[];
}) {
    const { data, setData, post } = useForm({
        date: "",
        professional_id: "",
        selectedTimes: [] as number[],
    });

    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
    const [availableSlots, setAvailableSlots] = useState<number[]>([]); // Lista de horários disponíveis
    const [error, setError] = useState<string | null>(null); // Estado de erro

    // Buscar horários disponíveis sempre que o profissional ou a data mudarem
    useEffect(() => {
        if (!data.professional_id || !data.date) return; // Evita chamadas desnecessárias

        const fetchAvailableSlots = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.post("/get-available-slots", {
                    professional_id: data.professional_id,
                    date: data.date,
                });

                if (response?.data?.available_slots) {
                    setAvailableSlots(response.data.available_slots); // Define horários disponíveis
                } else {
                    setAvailableSlots([]); // Limpa os horários disponíveis caso a resposta esteja vazia
                }
            } catch (err) {
                console.error("Erro ao buscar horários disponíveis:", err);
                setError(
                    "Houve um erro ao buscar os horários disponíveis. Tente novamente."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [data.professional_id, data.date]);

    // Alternar seleção de horários
    const handleCheckboxChange = (timeValue: number) => {
        if (data.selectedTimes.includes(timeValue)) {
            setData(
                "selectedTimes",
                data.selectedTimes.filter((t) => t !== timeValue)
            );
        } else {
            setData("selectedTimes", [...data.selectedTimes, timeValue]);
        }
    };

    // Submissão do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.professional_id || !data.date || data.selectedTimes.length === 0) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        post(route("public.appointment.add-datetime-to-cart"));
    };

    return (
        <AuthSimpleHeaderLayout
            title="Profissional, Data e Horários"
            description="Selecione o profissional a data e o horários para o seu atendimento."
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Seleção de Profissional */}
                <div>
                    <Label htmlFor="professional_id">
                        Profissional
                    </Label>
                    <select
                        className="form-select mt-1 block w-full p-2 border rounded-md"
                        value={data.professional_id}
                        onChange={(e) =>
                            setData("professional_id", e.target.value)
                        }
                    >
                        <option value="">Selecione um profissional</option>
                        {professionals.map((professional) => (
                            <option key={professional.id} value={professional.id}>
                                {professional.name}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Seleção de Data */}
                <div>
                    <Label htmlFor="birth">
                        Data
                    </Label>

                    <Input
                        id="birth"
                        type="date"
                        value={data.date}
                        onChange={(e) => setData("date", e.target.value)}
                    />
                </div>

                {/* Indicador de Carregamento */}
                {isLoading && <p className="text-blue-500">Carregando horários...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Exibição dos Horários */}
                <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Horários Disponíveis
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-4">
                    {AppointmentTimeEnumOptions.map((timeValue) => {
                        const isAvailable = availableSlots.includes(timeValue);
                        const isSelected = data.selectedTimes.includes(timeValue);

                        return (
                            <button
                                key={timeValue}
                                type="button"
                                aria-disabled={!isAvailable}
                                aria-pressed={isSelected}
                                aria-label={
                                    `${AppointmentTimeEnumLabels[timeValue]} ${
                                        isAvailable ? "Disponível" : "Indisponível"
                                    }`
                                }
                                className={`
                                    text-center text-sm px-2 py-2 rounded border 
                                    ${
                                        isAvailable
                                            ? isSelected
                                                ? "bg-blue-500 text-white"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }
                                    transition-colors duration-300 ease-in-out
                                `}
                                onClick={() => isAvailable && handleCheckboxChange(timeValue)}
                                disabled={!isAvailable}
                            >
                                {AppointmentTimeEnumLabels[timeValue]}
                            </button>
                        );
                    })}
                </div>
            </div>

                {/* Botão de Envio */}
                <Button
                    type="submit"
                    className={`w-full ${
                        !data.professional_id || !data.date || data.selectedTimes.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : ""
                    }`}
                    disabled={
                        !data.professional_id || !data.date || data.selectedTimes.length === 0
                    }
                >
                    Continuar
                </Button>
            </form>
        </AuthSimpleHeaderLayout>
    );
}
