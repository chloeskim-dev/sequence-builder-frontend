import { ReactNode, useState } from "react";
import { NavLinks } from "../NavLinks";

type Props = {
    children: ReactNode;
    pageTitle?: String;
    icon?: ReactNode;
};

export default function PageLayout({ children, pageTitle, icon }: Props) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

    const _navbarHeightInPixels = 50;
    const _footerHeightInPixels = 30;
    const _mainTitleHeightInPixels = 80;

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
    return (
        <div className="flex flex-col h-screen w-screen">
            {/* Navbar */}
            <nav
                className={`h-[50px] bg-my-bg2 text-my-fg px-4 flex items-center justify-between border-b border-mt-fg`}
            >
                <div className="text-lg font-bold">Sequence Builder Pro</div>
                <div className="hidden md:flex space-x-6">
                    <NavLinks setIsHamburgerOpen={setIsHamburgerOpen} />
                </div>
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
                <div className="md:hidden flex flex-col bg-my-bg2 text-my-fg px-4 py-2 space-y-2">
                    <NavLinks setIsHamburgerOpen={setIsHamburgerOpen} />
                </div>
            )}

            {/* page title */}
            {pageTitle && (
                <div
                    // className={`${mainTitleHeightStyleString} font-bold text-[30px] text-my-yellow flex justify-center items-center justify-center`}
                    className={`h-[80px] font-bold text-[30px] bg-my-bg px-8 text-my-yellow flex justify-center items-center justify-center`}
                >
                    {pageTitle}
                    {icon}
                </div>
            )}

            {/* Main - the only scrollable part*/}
            <main className="flex flex-col w-screen bg-my-bg overflow-y-auto">
                {/* page content */}
                <div
                    className="flex flex-col"
                    style={{
                        height: pageTitle
                            ? "calc(100vh - 160px)"
                            : "calc(100vh - 80px)",
                    }}
                >
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer
                className={`h-[30px] flex flex-row justify-center items-center bg-my-bg2 border-t border-mt-fg text-my-fg text-xs font-bold text-center`}
            >
                © 2025 Sequence Builder Pro
            </footer>
        </div>
    );
}
