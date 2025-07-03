import { Paginated, SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Filter, MessageSquareText, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import AlertConfirm from "@/components/alert-confirm";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/table/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Column } from "@/types/table";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { Appointment } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Props = {
    appointments: Paginated<Appointment>;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
};

const AppointmentIndex = ({
    appointments,
    sortField: initialSortField,
    sortOrder: initialSortOrder,
    search: initialSearch
}: Props) => {
    const { toastSuccess } = useToast();

    const [openAlert, setOpenAlert] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortField, setSortField] = useState<string | null>(initialSortField ?? "date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder ?? "desc");
    const [search, setSearch] = useState<string>(initialSearch ?? "");

    const fetchData = async (page: number, field: string, order: string, search: string) => {
        await router.get(route("appointments.index"), {
            page: page,
            sortField: field,
            sortOrder: order,
            search: search,
        }, { preserveState: true, preserveScroll: true });
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
        if (search === "" || search.length > 2) {
            const newCurrentPage = 1;
            setCurrentPage(newCurrentPage);
            fetchData(newCurrentPage, sortField ?? "", sortOrder ?? "", search);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pendente</Badge>;
            case 'paid':
                return <Badge className="bg-green-600 text-white hover:bg-green-700">Pago</Badge>;
            case 'completed':
                return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Concluído</Badge>;
            case 'canceled':
                return <Badge variant="destructive">Cancelado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const columns = useMemo<Column[]>(() => [

        {
            title: "Data",
            field: "date",
            sortable: true,
            render: (item) => new Intl.DateTimeFormat("pt-BR", { dateStyle: 'short' }).format(new Date(item.date)),
            align: "center"
        },

        { title: "Paciente", field: "patient.name", sortable: false },

        { title: "CPF", field: "patient.cpf", sortable: false },

        {
            title: "Valor Total",
            field: "total",
            sortable: true,
            render: (item) => new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(item.total),
            align: "right"
        },
        {
            title: "Status",
            field: "status",
            sortable: true,
            render: (item) => getStatusBadge(item.status),
            align: "center"
        },
        {
            title: "Ações",
            field: "actions",
            sortable: false,
            render: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {item.deleted_at == null && (
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Status</DropdownMenuLabel>

                                <DropdownMenuItem
                                    onClick={() => handleStatus(item.id, 'pending')}
                                    disabled={item.status === 'canceled' || item.status === 'completed'}
                                >
                                    <ChevronRight /> Pendente
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleStatus(item.id, 'paid')}
                                    disabled={item.status === 'canceled' || item.status === 'completed'}
                                >
                                    <ChevronRight /> Pago
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleStatus(item.id, 'canceled')}
                                    disabled={item.status === 'canceled' || item.status === 'completed'}
                                >
                                    <ChevronRight /> Cancelado
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleStatus(item.id, 'completed')}
                                    disabled={item.status === 'canceled' || item.status === 'completed'}
                                >
                                    <ChevronRight /> Concluído
                                </DropdownMenuItem>

                            </DropdownMenuGroup>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => presentAlert(item)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>



                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "text-center"
        }
    ], []);

    const presentAlert = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setOpenAlert(true);
    };

    const handleDelete = () => {
        if (!selectedAppointment) return;
        router.delete(route("appointments.destroy", selectedAppointment.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toastSuccess("Agendamento excluído com sucesso!");
                setSelectedAppointment(undefined);
            },
        });
    };

    const handleStatus = (id: number, status: string) => {
        router.patch(route('appointment.change.status', id), { status: status },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Atendimentos" />

            <div className="px-4 py-6">
                <Heading title="Atendimentos" description="Gerencie os atendimentos da clínica" />
                <div className="flex md:items-center md:justify-between justify-start md:flex-row gap-2 flex-col-reverse my-4">
                    <div className="flex gap-2 flex-col md:flex-row md:items-center">
                        <div className="relative">
                            <Input
                                placeholder="Pesquisar por paciente..."
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
                    {/* <Button asChild>
                        <Link href={route('appointments.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Agendamento
                        </Link>
                    </Button> */}
                </div>
                <DataTable
                    columns={columns}
                    data={appointments}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    handlePageChange={handlePageChange}
                />
                <AlertConfirm
                    title="Confirmar Exclusão"
                    message={`Você realmente deseja excluir o agendamento do paciente "${selectedAppointment?.patient.name}"? Esta ação não pode ser desfeita.`}
                    open={openAlert}
                    onOpenChange={setOpenAlert}
                    onConfirm={handleDelete}
                />
            </div>
        </AppLayout>
    );
};

export default AppointmentIndex;