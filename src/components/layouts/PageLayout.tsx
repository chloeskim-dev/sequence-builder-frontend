import { ReactNode, useState } from "react";
import { NavLinks } from "../NavLinks";
import styles from "./pagelayout.module.scss";
import { useNavigate } from "react-router-dom";

type Props = {
    children: ReactNode;
    pageTitle?: String;
};

export default function PageLayout({ children, pageTitle }: Props) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

    const navigate = useNavigate();

    const _navbarHeightInPixels = 70;
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
        <div className="bg-gray-3 flex flex-col h-screen w-full min-w-[320px] relative">
            {/* Navbar */}
            <nav className={`h-[45px] px-[20px] flex items-center`}>
                <div className={`flex w-full items-center justify-between`}>
                    {/* App Name (Navigates to Dashboard) */}
                    <button
                        className="text-lg font-bold my-auto"
                        onClick={() => {
                            navigate("/dashboard");
                        }}
                    >
                        Workout Class Builder
                    </button>

                    {/* Desktop Navlinks */}
                    <div className="hidden md:flex space-x-8">
                        <NavLinks
                            setIsHamburgerOpen={setIsHamburgerOpen}
                            isForMobile={false}
                        />
                    </div>

                    {/* Button to Open / Hide Mobile Navlinks */}
                    <button
                        className="md:hidden my-auto"
                        onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                        aria-label="Toggle Menu"
                    >
                        <svg
                            className="w-6 h-6 fill-current"
                            viewBox="0 0 24 24"
                        >
                            {isHamburgerOpen
                                ? CLOSE_ICON_SVG_PATH
                                : HAMBURGER_ICON_SVG_PATH}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navlinks */}
                <div className="">
                    {isHamburgerOpen && (
                        <div
                            className={`bg-gray-3 bg-opacity-95 md:hidden top-[45px] right-[20px] px-[30px] py-3 space-y-4 absolute z-50 }`}
                        >
                            <NavLinks
                                setIsHamburgerOpen={setIsHamburgerOpen}
                                isForMobile={true}
                            />
                        </div>
                    )}
                </div>
            </nav>

            <main
                style={{
                    height: "calc(100vh - 45px)",
                }}
                className="flex flex-col w-full px-[20px]"
            >
                {/* Main (Scrollable) */}
                <div
                    className={`flex flex-col w-full gap-4 h-full bg-gray-2  mb-[20px] py-[20px] ${styles["floating"]} overflow-y-auto scrollbar-padded scrollbar-custom`}
                >
                    {/* page title */}
                    {pageTitle && (
                        <div
                            className={`font-bold text-center text-[30px] px-8 text-my-bg flex justify-center items-center justify-center`}
                        >
                            {pageTitle}
                        </div>
                    )}
                    {/* page content */}
                    <div className="w-full flex-1">{children}</div>
                </div>
            </main>
        </div>
    );
}
