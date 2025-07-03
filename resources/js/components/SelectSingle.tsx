import { OptionType } from "@/types/select";
import React from "react";
import Select, { ActionMeta } from "react-select";
//import { useTheme } from "@/Components/Layout/ThemeProvider"

interface Props {
    id: string;
    options: OptionType[];
    value: OptionType | null;
    onChange: (option: OptionType | null, actionMeta: ActionMeta<OptionType>) => void;
    placeholder?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
}

const SelectSingle: React.FC<Props> = ({
    id,
    options,
    value,
    onChange,
    placeholder = "Selecione...",
    isDisabled = false,
    isLoading = false,
    isClearable = false,
    isSearchable = false,
}) => {
    //const { theme } = useTheme();

    return (
        <Select
            id={id}
            name={id}
            className="react-select-single-container"
            classNamePrefix="react-select-single"
            options={options}
            value={value}
            onChange={(option, action) =>
                onChange(option as OptionType, action)
            }
            placeholder={placeholder}
            isDisabled={isDisabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isSearchable={isSearchable}

            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: "transparent",
                    borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
                    borderWidth: "1px",
                    borderRadius: "6px",
                    boxShadow: "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"
                }),
                input: (provided: any) => ({
                    ...provided,
                    backgroundColor: "transparent",
                    color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                }),
                placeholder: (provided: any) => ({
                    ...provided,
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem",
                }),

                // options from dropdown list
                option: (provided: any, state: { isSelected: boolean }) => ({
                    ...provided,
                    color: "hsl(var(popover-foreground))",
                    backgroundColor: "hsl(var(--popover))",
                    ":hover": {
                        backgroundColor: "hsl(var(--muted))",
                    },
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "hsl(var(--popover))",
                }),

                // selected value
                singleValue: (base) => ({
                    ...base,
                    color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                }),
            }}
        />
    );
};

export default SelectSingle;
