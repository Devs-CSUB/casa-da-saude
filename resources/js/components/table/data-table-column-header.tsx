import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Column } from "@/types/table";
import { TableHead } from "../ui/table";

interface ColumnHeaderProps {
    column: Column;
    sortField: string | null;
    sortOrder: "asc" | "desc" | null;
    handleSort?: (field: string) => void;
}


export default function DataTableColumnHeader({ column, sortField, sortOrder, handleSort }: ColumnHeaderProps) {
    const handleClick = () => {
        if (column.sortable && handleSort)
            handleSort(column.field);
    };

    const align = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[column.align ?? 'left'];

    return (
        <TableHead onClick={handleClick} className={cn(`cursor-pointer ${column.sortable === true ? "hover:bg-accent" : ""}`, column.className)}>
            <div className={cn("flex items-center space-x-1", align)}>
                {column.title}
                {column.sortable && (
                    sortField === column.field ? (sortOrder === "desc" ? (
                        <ArrowDown className="h-4 w-4" />
                    ) : (
                        <ArrowUp className="h-4 w-4" />
                    )) : (
                        <ChevronsUpDown className="h-4 w-4" />
                    )
                )}
            </div>
        </TableHead>
    );
}