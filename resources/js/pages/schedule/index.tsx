import { Paginated, SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Plus, Trash2, Eye, X } from "lucide-react";
import AlertConfirm from "@/components/alert-confirm";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/table/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Column } from "@/types/table";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { Schedule } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Props = {
    schedules: Paginated<Schedule>;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
};

const ScheduleIndex = ({
    schedules,
    sortField: initialSortField,
    sortOrder: initialSortOrder,
    search: initialSearch
}: Props) => {
    const { toastSuccess } = useToast();

    const [openAlert, setOpenAlert] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState<string | null>(initialSortField ?? "id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder ?? "desc");
    const [search, setSearch] = useState<string>(initialSearch ?? "");

    const fetchData = async (page: number, field: string, order: string, search: string) => {
        await router.get(route("schedules.index"), {
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

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm ?? "");
        if (searchTerm == "" || searchTerm.length > 2) {
            const currentPage = 1;
            setCurrentPage(currentPage);
            fetchData(currentPage, sortField ?? "", sortOrder ?? "", searchTerm);
        }
    };

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const columns = useMemo<Column[]>(() => [
        { title: "#", field: "id", sortable: true, align: "center" },
        {
            title: "Data",
            field: "date",
            sortable: true,
            align: "center"
        },
        {
            title: "Profissional",
            field: "professional.name",
            sortable: true,
            render: (item) => item.professional?.name ?? "Não informado"
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
                        <DropdownMenuItem asChild>
                            <Link href={route('schedules.show', item.id)}>
                                <Eye /> Visualizar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('schedules.edit', item.id)}>
                                <Edit /> Editar
                            </Link>
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
        },
    ], [openDropdownId]);

    const presentAlert = (agenda: Schedule) => {
        setSelectedSchedule(agenda);
        setOpenAlert(true);
    };

    const handleDelete = () => {
        router.delete(route("schedules.destroy", selectedSchedule?.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toastSuccess("Sucesso", "Agenda deletada!");
                setSelectedSchedule(undefined);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Agendas dos Profissionais" />

            <div className="px-4 py-6">
                <Heading title="Agendas" description="Gerencie as agendas associadas aos profissionais" />
                <div className="flex md:items-center md:justify-between justify-start md:flex-row gap-2 flex-col-reverse my-4">
                    <div className="flex gap-2 flex-col md:flex-row md:items-center">
                        <div className="relative">
                            <Input
                                placeholder="Pesquisar por profissional ou data..."
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
                        <Link href={route('schedules.create')}>
                            <Plus />
                            Nova Agenda
                        </Link>
                    </Button>
                </div>
                <DataTable
                    columns={columns}
                    data={schedules}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    handlePageChange={handlePageChange}
                />
                <AlertConfirm
                    title="Confirmação"
                    message={`Você realmente deseja excluir a agenda do profissional "${selectedSchedule?.professional?.name}" na data ${selectedSchedule?.date
                        ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(selectedSchedule.date))
                        : "data inválida"
                        }?`}
                    open={openAlert}
                    onOpenChange={setOpenAlert}
                    onConfirm={handleDelete}
                />
            </div>
        </AppLayout>
    );
};

export default ScheduleIndex;
