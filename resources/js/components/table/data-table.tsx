import DataTableColumnHeader from "./data-table-column-header";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import DataTablePagination from "./data-table-pagination";
import { Paginated } from "@/types";
import { cn } from "@/lib/utils";
import { Column } from "@/types/table";

interface DataTableProps<T> {
    columns: Column[];
    data: Paginated<T> | T[];
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
    handleSort?: (field: string) => void;
    handlePageChange?: (page: number) => void;
}

function isPaginated<T>(data: any): data is Paginated<T> {
    return (
        data &&
        Array.isArray(data.data) &&
        typeof data.meta === "object" &&
        typeof data.links === "object"
    );
}

export default function DataTable<T>({
    columns,
    data,
    sortField,
    sortOrder,
    handleSort,
    handlePageChange,
}: DataTableProps<T>) {

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc?.[part] ?? "", obj);
    };

    const align = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    // Verifica se os dados são paginados
    const isDataPaginated = isPaginated<T>(data);

    // Determina os dados a serem renderizados
    const tableData = isDataPaginated ? data.data : data as T[];

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <DataTableColumnHeader
                                    key={column.field}
                                    column={column}
                                    sortField={sortField ?? null}
                                    sortOrder={sortOrder ?? null}
                                    handleSort={handleSort}
                                />
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData && tableData.length ? (
                            tableData.map((item, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.field} className={cn(column.className, align[column.align ?? 'left'])}>
                                            {column.render ? column.render(item) : String(getNestedValue(item, column.field))}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Renderiza a paginação apenas se os dados forem paginados */}
            {isDataPaginated && (
                <DataTablePagination
                    meta={data.meta}
                    links={data.links}
                    count={tableData.length}
                    onPageChange={handlePageChange!}
                />
            )}
        </div>
    );
}