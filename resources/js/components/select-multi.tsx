import { OptionType } from "@/types/select";
import React from "react";
import Select, { ActionMeta } from "react-select";

interface Props {
    id: string;
    options: OptionType[];
    value: OptionType[];
    onChange: (selected: OptionType[], action: ActionMeta<OptionType>) => void;
    placeholder?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
}

const SelectMulti: React.FC<Props> = ({
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

    return (
        <Select
            id={id}
            name={id}
            className="react-select-multi-container shadow-sm"
            classNamePrefix="react-select-multi"
            isMulti
            options={options}
            value={value}
            onChange={(selected, action) =>
                onChange(selected as OptionType[], action)
            }
            placeholder={placeholder}
            closeMenuOnSelect={false}
            isDisabled={isDisabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isSearchable={isSearchable}

            styles={{
                control: (base, state) => ({
                    ...base,
                    //backgroundColor: "transparent",
                    borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
                    borderWidth: "1px",
                    borderRadius: "8px",
                    boxShadow: "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"
                }),
                input: (provided: any) => ({
                    ...provided,
                    //backgroundColor: "transparent",
                    // color: "hsl(var(--foreground))",
                    fontSize: "0.875rem",

                }),
                placeholder: (provided: any) => ({
                    ...provided,
                    // color: "hsl(var(--muted-foreground))",
                    fontSize: "0.875rem",
                }),

                // options from dropdown list
                option: (provided: any, state: { isSelected: boolean }) => ({
                    ...provided,
                    color: "var(popover-foreground)",
                    backgroundColor: "var(--popover)",
                    ":hover": {
                        backgroundColor: "var(--muted)",
                    },
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "var(--popover)",
                }),

                // selected value
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: "var(--primary)",
                    borderRadius: "4px",
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: "var(--primary-foreground)",
                    fontWeight: "500",
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    cursor: "pointer",
                    color: "var(--secondary)",
                    ":hover": {
                        color: "var(--destructive)",
                    },
                }),
            }}
        />
    );
};

export default SelectMulti;