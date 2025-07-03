import { BreadcrumbItem, Paginated, SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import AlertConfirm from "@/components/alert-confirm";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/table/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Column } from "@/types/table";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { Procedure } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Props = {
    procedures: Paginated<Procedure>;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
}

/*const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '#',
    },
    {
        title: 'Procedimentos',
        href: '#',
    },
];
*/

const ProcedureIndex = ({
    procedures,
    sortField: initialSortField,
    sortOrder: initialSortOrder,
    search: initialSearch
}: Props) => {
    const { toastSuccess } = useToast();

    const [openAlert, setOpenAlert] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState<string | null>(initialSortField ?? "id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder ?? "desc");
    const [search, setSearch] = useState<string>(initialSearch ?? "");

    const fetchData = async (page: number, field: string, order: string, search: string) => {
        await router.get(route("procedures.index"), {
            page: page,
            sortField: field,
            sortOrder: order,
            search: search,
        }, { preserveState: true });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchData(page, sortField ?? "", sortOrder ?? "", search ?? "");
    };

    const handleSort = (field: string) => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newSortOrder);
        fetchData(currentPage, field, newSortOrder, search ?? "");
    };

    const handleSearch = (search: string) => {
        setSearch(search ?? "");
        if (search == "" || search.length > 2) {
            const currentPage = 1;
            setCurrentPage(currentPage);
            fetchData(currentPage, sortField ?? "", sortOrder ?? "", search);
        }
    };

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const columns = useMemo<Column[]>(() => [
        { title: "#", field: "id", sortable: true },
        {
            title: "Nome",
            field: "name",
            sortable: true,
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <span>{item.name}</span>
                    <span className="table-cell md:hidden text-xs text-muted-foreground">{item.category?.name}</span>
                </div>
            )
        },
        { title: "Categoria", field: "category.name", sortable: true, className: "hidden md:table-cell" },
        { title: "Descrição", field: "description", sortable: true },
        { title: "Duração (min)", field: "duration", sortable: true },
        {
            title: "Preço (R$)",
            field: "price",
            sortable: true,
            render: (item) => `R$ ${Number(item.price).toFixed(2)}`
        },
        {
            title: "Ativo",
            field: "is_active",
            sortable: true,
            render: (item) => (
                item.is_active
                    ? <Badge className="bg-green-600 text-white">Sim</Badge>
                    : <Badge variant="destructive">Não</Badge>
            )
        },
        {
            title: "Ações",
            field: "actions",
            sortable: false,
            render: (item) => (
                <DropdownMenu
                    open={openDropdownId === item.id}
                    onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? item.id : null)}
                >
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.get(route('procedures.edit', item.id))}>
                            <Edit /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setOpenDropdownId(null);
                            presentAlert(item);
                        }}>
                            <Trash2 /> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "flex justify-center"
        }
    ], [openDropdownId]);

    const presentAlert = (procedure: Procedure) => {
        setSelectedProcedure(procedure);
        setOpenAlert(true);
    };

    const handleDelete = () => {
        router.delete(route("procedures.destroy", selectedProcedure?.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toastSuccess("Procedimento deletado!");
                setSelectedProcedure(undefined);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Procedimentos" />

            <div className="px-4 py-6">
                <Heading title="Procedimentos" description="Gerencie os procedimentos disponíveis" />
                <div className="flex md:items-center md:justify-between justify-start md:flex-row gap-2 flex-col-reverse my-4">
                    <div className="flex gap-2 flex-col md:flex-row md:items-center">
                        <div className="relative">
                            <Input
                                placeholder="Pesquisar..."
                                value={search}
                                onChange={(event) => handleSearch(event.target.value)}
                                className="pr-10"
                            />
                            {search && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={route('procedures.create')}>
                            <Plus />
                            Novo Procedimento
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={procedures}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    handlePageChange={handlePageChange}
                />
                <AlertConfirm
                    title="Confirmação"
                    message={`Você realmente deseja excluir o procedimento "${selectedProcedure?.name}"?`}
                    open={openAlert}
                    onOpenChange={setOpenAlert}
                    onConfirm={handleDelete}
                />
            </div>
        </AppLayout>
    );
};

export default ProcedureIndex;
