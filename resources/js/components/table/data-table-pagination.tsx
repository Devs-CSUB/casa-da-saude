import { PaginatedLinks, PaginatedMeta } from "@/types";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

interface PaginationProps {
    meta: PaginatedMeta;
    links: PaginatedLinks;
    count: number;
    onPageChange: (page: number) => void;
}

const DataTablePagination = ({ meta, links, count, onPageChange }: PaginationProps) => {

    const handlePageClick = (page: number) => {
        onPageChange(page);  // Chama a função para mudar a página
    };

    return (
        <>
            <nav role="navigation" aria-label="Navegação de Paginação"
                className="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
                <div className="flex flex-1 justify-between sm:hidden">
                    {
                        meta.current_page != 1
                            ? (
                                <button key={"nav-button-prev"}
                                    onClick={() => handlePageClick(meta.current_page - 1)}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 ring-gray-300 transition duration-150 ease-in-out hover:text-gray-500 focus:border-blue-300 focus:outline-none focus:ring active:bg-gray-100 active:text-gray-700"
                                >
                                    Página Anterior
                                </button>
                            )
                            : (
                                <span
                                    className="relative inline-flex cursor-default items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-500">
                                    Página Anterior
                                </span>
                            )
                    }

                    {
                        meta.current_page != meta.last_page
                            ? (
                                <button key={"nav-button-next"}
                                    onClick={() => handlePageClick(meta.current_page + 1)}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 ring-gray-300 transition duration-150 ease-in-out hover:text-gray-500 focus:border-blue-300 focus:outline-none focus:ring active:bg-gray-100 active:text-gray-700"
                                >
                                    Próxima Página
                                </button>
                            )
                            : (
                                <span
                                    className="relative ml-3 inline-flex cursor-default items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-500">
                                    Próxima Página
                                </span>
                            )
                    }

                </div >
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm">
                            {
                                meta.from
                                    ? (
                                        <span className="font-light">{meta.from} - {meta.to} </span>
                                    )
                                    : (
                                        <span className="font-light">{count} </span>
                                    )
                            }
                            de
                            <span className="font-light"> {meta.total} </span>
                            resultados
                        </p>
                    </div>

                    <ol className="flex">
                        {/* Previous Page Link */}
                        {
                            meta.current_page != 1
                                ? (
                                    <li key={"nav-item-prev"} className="rounded-l-lg bg-slate-200 dark:bg-neutral-800">
                                        <button key={"nav-link-prev"}
                                            onClick={() => handlePageClick(meta.current_page - 1)}
                                            rel="prev"
                                            aria-label="Página Anterior"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-slate-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:active:bg-neutral-600/90"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    </li>
                                )
                                : (
                                    <li key={"nav-item-prev"} className="rounded-l-lg bg-slate-200 dark:bg-neutral-800">
                                        <span aria-disabled="true" aria-label="Página Anterior"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-slate-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:active:bg-neutral-600/90">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </span>
                                    </li>
                                )
                        }

                        {/* Pagination Elements */}
                        {
                            meta.links.map((item, index) => (

                                item.active
                                    ? (
                                        <li key={`nav-item-${index}`} className="bg-slate-200 dark:bg-neutral-800">
                                            <span aria-current="page"
                                                className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">{item.label}</span>
                                        </li>

                                    )
                                    : (
                                        (item.url && !isNaN(parseInt(item.label))) && (
                                            <li key={`nav-item-${index}`} className="bg-slate-200 dark:bg-neutral-800">
                                                <button key={`nav-link-${index}`}
                                                    onClick={() => handlePageClick(parseInt(item.label))}
                                                    aria-label={`Ir para página ${item.label}`}
                                                    className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:active:bg-neutral-600/90"
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        )
                                    )
                            ))
                        }

                        {/* Next Page Link */}
                        {
                            meta.current_page != meta.last_page
                                ? (
                                    <li key={"nave-item-next"} className="rounded-r-lg bg-slate-200 dark:bg-neutral-800">
                                        <button key={"nave-link-next"}
                                            onClick={() => handlePageClick(meta.current_page + 1)}
                                            rel="next"
                                            aria-label="Próxima Página"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-slate-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:active:bg-neutral-600/90">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </li>
                                )
                                : (
                                    <li className="rounded-r-lg bg-slate-200 dark:bg-neutral-800">
                                        <span aria-disabled="true" aria-label="Próxima Página"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-slate-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:active:bg-neutral-600/90">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </li>
                                )
                        }
                    </ol >
                </div >
            </nav >
        </>
    );
};

export default DataTablePagination;