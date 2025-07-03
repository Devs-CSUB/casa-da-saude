import React, { forwardRef, useRef, useImperativeHandle } from "react";
import MaskedInput, { Props as MaskedInputProps } from "react-input-mask";
import { Input } from "@/components/ui/input";

// Propriedades do componente
interface TextInputMaskProps extends MaskedInputProps {
    id: string; // ID para o campo
    label?: string; // Rótulo opcional
    placeholder?: string; // Placeholder opcional
}

// Componente com máscara
const TextInputMask = forwardRef<HTMLInputElement, TextInputMaskProps>(
    ({ id, label, placeholder, ...props }, ref) => {
        // Referência interna para capturar o DOM do <input>
        const localInputRef = useRef<HTMLInputElement | null>(null);

        // Expor a referência correta
        useImperativeHandle(ref, () => localInputRef.current as HTMLInputElement);

        return (
            <div className="flex flex-col gap-2">
                {/* Rótulo opcional */}
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}

                {/* Campo mascarado */}
                <MaskedInput
                    {...props} // Props do react-input-mask
                    ref={(maskedInputInstance) => {
                        // Extraindo o <input> DOM de dentro do MaskedInput
                        if (
                            maskedInputInstance &&
                            "inputElement" in maskedInputInstance
                        ) {
                            localInputRef.current = maskedInputInstance.inputElement as HTMLInputElement;
                        }
                    }}
                    id={id} // ID para acessibilidade
                    placeholder={placeholder} // Placeholder no campo
                >
                    {(inputProps) => (
                        <Input
                            {...inputProps} // Props internas do input
                            id={id}
                            placeholder={placeholder}
                        />
                    )}
                </MaskedInput>
            </div>
        );
    }
);

TextInputMask.displayName = "TextInputMask";

export default TextInputMask;
