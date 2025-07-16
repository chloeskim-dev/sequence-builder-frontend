import { ReactNode, useState } from "react";
import { NavLinks } from "../NavLinks";

type Props = {
    children: ReactNode;
    pageTitle?: String;
    icon?: ReactNode;
};

const HAMBURGER_ICON_SVG_PATH = (
    <path
        fillRule="evenodd"
        d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"
        clipRule="evenodd"
    />
);

const CLOSE_ICON_SVG_PATH = (
    <path
        fillRule="evenodd"
        d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586 5.636 15.536l1.414 1.414L12 12.828l4.95 4.95 1.414-1.414L13.414 10.586 18.364 5.636z"
        clipRule="evenodd"
    />
);

export default function PageLayout({ children, pageTitle, icon }: Props) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            {/* <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between"> */}
            {/* <nav className="bg-gb-aqua text-white px-4 py-3 flex items-center justify-between"> */}
            <nav className="bg-gb-bg text-mt-fg px-4 py-3 flex items-center justify-between border-b border-mt-fg ">
                <div className="text-lg font-bold">Sequence Builder Pro</div>

                <div className="hidden md:flex space-x-4">
                    <NavLinks />
                </div>

                {/* Mobile hamburger - hidden on medium+ */}
                <button
                    className="md:hidden"
                    onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        {isHamburgerOpen
                            ? CLOSE_ICON_SVG_PATH
                            : HAMBURGER_ICON_SVG_PATH}
                    </svg>
                </button>
            </nav>

            {/* Mobile menu */}
            {isHamburgerOpen && (
                <div className="md:hidden flex flex-col bg-blue-700 text-white px-4 py-2 space-y-2">
                    <NavLinks />
                </div>
            )}

            {/* Page content */}
            <main className="bg-mt-bg flex-1 p-4">
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xl text-gb-yellow my-2 flex items-center justify-center">
                        {pageTitle && pageTitle}
                        {icon && icon}
                    </div>
                    <div>{children}</div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gb-bg border-t border-mt-fg text-mt-fg text-xs font-bold text-center p-2">
                © 2025 Sequence Builder Pro
            </footer>
        </div>
    );
}
