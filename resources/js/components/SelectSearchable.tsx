import React, { useState } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
//import { useTheme } from "@/Components/Layout/ThemeProvider";
import { OptionType } from "@/types/select";

interface Props {
    value: OptionType | null; // A opção selecionada
    onChange: (selected: OptionType | null, action: ActionMeta<OptionType>) => void; // Callback para mudanças
    placeholder?: string;
    fetchOptions: (inputValue: string) => Promise<OptionType[]>; // Função para buscar opções
    isDisabled?: boolean;
}

const SelectSearchable: React.FC<Props> = ({
    value,
    onChange,
    placeholder = "Buscar...",
    fetchOptions,
    isDisabled = false,
}) => {
    //const { theme } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Função para buscar opções conforme o usuário digita
    const handleInputChange = (inputValue: string) => {
        setIsLoading(true);
        fetchOptions(inputValue)
            .then((data) => {
                setOptions(data);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <Select
            isClearable
            isSearchable
            isDisabled={isDisabled}
            options={options}
            value={value}
            onChange={(selected: SingleValue<OptionType>, action: ActionMeta<OptionType>) =>
                onChange(selected, action)
            }
            onInputChange={handleInputChange}
            placeholder={placeholder}
            isLoading={isLoading}
            className="react-select-container shadow-sm"
            classNamePrefix="react-select"
            noOptionsMessage={() => "Nenhum resultado encontrado"}
            loadingMessage={() => "Carregando..."}
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: "transparent",
                    borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
                    borderWidth: "1px",
                    borderRadius: "6px",
                    "&:hover": {
                        borderColor: "hsl(var(--ring))",
                    },
                }),
                input: (provided: any) => ({
                    ...provided,
                    backgroundColor: "transparent",
                    color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                    boxShadow: "#000",
                }),
                placeholder: (provided: any) => ({
                    ...provided,
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem",
                }),
                option: (provided: any, state: { isSelected: boolean }) => ({
                    ...provided,
                    color: "hsl(var(--foreground))",
                    backgroundColor: "hsl(var(--background))",
                    ":hover": {
                        backgroundColor: "hsl(var(--muted))",
                    },
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "hsl(var(--background))",
                }),
                singleValue: (base) => ({
                    ...base,
                    color: "hsl(var(--foreground))",
                }),
            }}
        />
    );
};

export default SelectSearchable;