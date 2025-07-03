import AppLogo from "@/components/app-logo";
import AppearanceToggleDropdown from "@/components/appearance-dropdown";
import { Link } from "@inertiajs/react";
import { type PropsWithChildren } from "react";

export default function FullWidthHeaderLayout({ children }: PropsWithChildren) {
    return (
        <div className="bg-background flex flex-col min-h-screen">
            {/* Barra Superior */}
            <div className="w-full bg-background border-b shadow">
                <div className="h-[80px] mx-auto flex w-full max-w-[1200px] items-center justify-between px-4">
                    {/* Logo no lado esquerdo */}
                    <Link href={route("home")} className="flex items-center gap-2 font-medium">
                        <AppLogo className="w-40 dark:brightness-[10000%]" />
                    </Link>

                    {/* Appearance Dropdown no lado direito */}
                    <AppearanceToggleDropdown />
                </div>
            </div>

            {/* Conteúdo Central */}
            <div className="flex flex-1 flex-col items-center w-full mx-auto">
                <div className="flex flex-col gap-8 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
