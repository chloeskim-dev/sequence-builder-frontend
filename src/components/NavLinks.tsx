import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface Props {
    setIsHamburgerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavLinks = ({ setIsHamburgerOpen }: Props) => {
    const { logout } = useUser();

    const navLinkTextStyles = "hover:underline font-extrabold md:mr-2";

    return (
        <>
            <Link
                to="/dashboard"
                onClick={() => setIsHamburgerOpen(false)}
                className={navLinkTextStyles}
            >
                Dashboard
            </Link>
            <Link
                to="/sequences"
                onClick={() => setIsHamburgerOpen(false)}
                className={navLinkTextStyles}
            >
                Sequences
            </Link>
            <Link
                to="/favorite-exercises"
                onClick={() => setIsHamburgerOpen(false)}
                className={navLinkTextStyles}
            >
                Favorite Exercises
            </Link>

            <button
                onClick={logout}
                className="hover:underline text-left bg-none border-none p-0 text-inherit font-extrabold"
            >
                Logout
            </button>
        </>
    );
};
