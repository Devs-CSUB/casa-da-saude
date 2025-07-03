import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { OptionType } from '@/types/select';
import { DialogProps } from '@radix-ui/react-dialog';

type Props = DialogProps & {
    selected: User;
}

export default function UserShow({ onOpenChange, selected, ...props }: Props) {
    return (
        <Dialog onOpenChange={onOpenChange} {...props} >
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle className='space-x-2'>
                        <span>Visualização de Usuário: {selected.name}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Informações do usuário.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 pt-4">
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={selected.name}
                            disabled
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-right">
                            E-mail
                        </Label>
                        <Input
                            id="email"
                            value={selected.email}
                            disabled
                        />
                    </div>
                    <div className="space-x-2 text-sm text-muted-foreground">
                        <span>
                            Criado Em: {selected.created_at ? new Date(selected.created_at).toLocaleString() : 'Não disponível'}
                        </span>
                        <span>
                            Atualizado Em: {selected.updated_at ? new Date(selected.updated_at).toLocaleString() : 'Não disponível'}
                        </span>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}