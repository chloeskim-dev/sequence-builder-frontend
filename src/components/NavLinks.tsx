import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const NavLinks = () => {
    const { logout } = useUser();

    const navLinkTextStyles = "hover:underline text-sm font-extrabold md:mr-2";

    return (
        <>
            <Link to="/dashboard" className={navLinkTextStyles}>
                Dashboard
            </Link>
            <Link to="/sequences" className={navLinkTextStyles}>
                Sequences
            </Link>
            <Link to="/favorite-exercises" className={navLinkTextStyles}>
                Favorite Exercises
            </Link>

            <button
                onClick={logout}
                className="hover:underline text-left bg-none border-none p-0 text-inherit text-sm font-extrabold"
            >
                Logout
            </button>
        </>
    );
};
