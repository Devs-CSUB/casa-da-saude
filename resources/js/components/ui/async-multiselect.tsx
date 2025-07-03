import React, { ChangeEvent } from 'react';

type Option = {
    value: number; // ID ou valor único
    label: string; // Texto que será exibido na opção
};

type AsyncMultiSelectProps = {
    placeholder: string; // Texto de instrução (exibido como primeira opção)
    value: Option[]; // Opções já selecionadas
    loadOptions: (inputValue: string) => Promise<Option[]>; // Função para buscar opções
    onChange: (selected: Option[]) => void; // Callback para mudança em seleção
    isClearable?: boolean; // Permitir limpar a seleção
    isLoading?: boolean; // Mostrar estado de carregamento
    noOptionsMessage?: () => string; // Mensagem quando não há opções
};

export default function AsyncMultiSelect({
    placeholder, // Placeholder será tratado como uma <option>
    value,
    loadOptions,
    onChange,
    isClearable = false, // Default é false
    isLoading = false, // Default é false
    noOptionsMessage = () => 'Nenhuma opção disponível', // Texto padrão para falta de opções
}: AsyncMultiSelectProps) {
    const [options, setOptions] = React.useState<Option[]>([]); // Estado para armazenar as opções carregadas

    /**
     * Busca as opções dinamicamente ao modificar o input de busca.
     */
    const handleInputChange = async (inputValue: string) => {
        const loadedOptions = await loadOptions(inputValue); // Busca opções
        setOptions(loadedOptions); // Atualiza estado local com as novas opções
    };

    /**
     * Trata a mudança na seleção.
     */
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value; // Valor selecionado
        const selectedOption = options.find((option) => option.value.toString() === selectedValue);

        // Chama a função `onChange` com a opção selecionada, ou limpa seleção
        onChange(selectedOption ? [selectedOption] : []);
    };

    return (
        <div className="relative">
            {/* Campo de seleção */}
            <select
                className="form-select block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                onChange={handleChange}
                value={value.length > 0 ? value[0].value.toString() : ''} // Exibe o valor selecionado ou vazio
            >
                {/* Placeholder como a primeira opção */}
                <option value="" disabled>
                    {placeholder}
                </option>

                {/* Renderizar estado "Carregando" */}
                {isLoading ? (
                    <option disabled>Carregando...</option>
                ) : options.length > 0 ? (
                    // Renderiza as opções carregadas
                    options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                ) : (
                    // Exibe mensagem de "nenhuma opção disponível" caso não haja dados
                    <option disabled>{noOptionsMessage()}</option>
                )}
            </select>

            {/* Botão para limpar seleção (se permitido e houver dados selecionados) */}
            {isClearable && value.length > 0 && (
                <button
                    type="button"
                    onClick={() => onChange([])} // Chama `onChange` com lista vazia para limpar a seleção
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                >
                    Limpar
                </button>
            )}
        </div>
    );
}
