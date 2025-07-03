import { BreadcrumbItem, Paginated, User } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import AlertConfirm from "@/components/alert-confirm";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/table/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Column } from "@/types/table";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/models";

type Props = {
    users: Paginated<User>;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
};

const UserIndex = ({
    users,
    sortField: initialSortField = "id",
    sortOrder: initialSortOrder = "desc",
    search: initialSearch = "",
}: Props) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState<string | null>(initialSortField);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
    const [search, setSearch] = useState<string>(initialSearch);
    const [openAlert, setOpenAlert] = useState<boolean>(false);

    const fetchData = async (page: number, field: string, order: string, search: string) => {
        await router.get(route("users.index"), {
            page,
            sortField: field,
            sortOrder: order,
            search,
        }, { preserveState: true });
    };

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        if (searchTerm === "" || searchTerm.length > 2) {
            setCurrentPage(1); // Reset page to 1
            fetchData(1, sortField ?? "", sortOrder ?? "", searchTerm);
        }
    };

    const handleSort = (field: string) => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newSortOrder);
        fetchData(currentPage, field, newSortOrder, search);
    };

    const handleDelete = () => {
        if (!selectedUser) return;

        router.delete(route("users.destroy", selectedUser.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast("Sucesso", { description: "Usuário deletado com sucesso!" });
                setSelectedUser(null);
            },
        });
    };

    const columns = useMemo<Column[]>(
        () => [
            { title: "#", field: "id", sortable: true },
            {
                title: "Nome",
                field: "name",
                sortable: true,
                render: (item) => (
                    <div className="flex flex-col gap-1">
                        <span>{item.name}</span>
                        <span className="table-cell md:hidden text-xs text-muted-foreground">{item.email}</span>
                    </div>
                ),
            },
            { title: "E-mail", field: "email", sortable: true, className: "hidden md:table-cell" },
            { title: "Área", field: "area.name", sortable: true, className: "hidden md:table-cell" },
            {
                title: 'Perfis',
                field: 'roles',
                sortable: false,
                render: (item) => {
                    return (
                        <div className="flex space-x-1">
                            {item.roles.map((item: Role) => (
                                <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                                    {item.name}
                                </Badge>
                            ))}
                        </div>
                    )
                },
                className: 'hidden md:table-cell',
            },
            {
                title: "Ações",
                field: "actions",
                sortable: false,
                className: "flex justify-center",
                render: (item: User) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={route("users.edit", item.id)}>
                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setSelectedUser(item);
                                setOpenAlert(true);
                            }}>
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [sortField, sortOrder]
    );

    return (
        <AppLayout>
            <Head title="Usuários" />
            <div className="px-4 py-6">
                <Heading title="Usuários" description="Gerencie os usuários do sistema" />

                {/* Search bar and New User button */}
                <div className="flex justify-between items-center gap-4 mb-6">
                    <Input
                        placeholder="Pesquisar..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button asChild>
                        <Link href={route("users.create")}>
                            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                        </Link>
                    </Button>
                </div>

                {/* Data table */}
                <DataTable
                    columns={columns}
                    data={users}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    handlePageChange={(page) => {
                        setCurrentPage(page);
                        fetchData(page, sortField ?? "", sortOrder ?? "", search);
                    }}
                />

                {/* Delete confirmation alert */}
                <AlertConfirm
                    title="Confirmação"
                    message={`Deseja realmente excluir o usuário "${selectedUser?.name}"?`}
                    open={openAlert}
                    onOpenChange={setOpenAlert}
                    onConfirm={handleDelete}
                />
            </div>
        </AppLayout>
    );
};

export default UserIndex;
