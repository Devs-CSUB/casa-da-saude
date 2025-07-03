import { toast as sonnerToast } from "sonner";

export function useToast() {
    type ToastProps = {
        type: 'success' | 'warning' | 'error' | null
        title: string;
        description: string;
    }

    const toastSuccess = (description: string, title?: string) =>
        sonnerToast.success(title ?? "Sucesso", { description: description ?? "" });

    const toastError = (description: string, title?: string) =>
        sonnerToast.error(title ?? "Erro", { description: description ?? "" });

    const toastWarning = (description: string, title?: string) =>
        sonnerToast.warning(title ?? "Atenção", { description: description ?? "" });

    const toast = ({ type, title, description }: ToastProps) => {
        if (type == 'success') {
            toastSuccess(description, title);
        } else if (type == 'error') {
            toastError(description, title);
        } else if (type == 'warning') {
            toastWarning(description, title);
        } else {
            sonnerToast(title || "Mensagem", {
                description,
            });
        }
    };

    return { toast, toastSuccess, toastError, toastWarning };
}