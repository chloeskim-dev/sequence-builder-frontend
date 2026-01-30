import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Button from "./ui/Button/Button";
import styles from "./Button/Button.module.scss";
import { FiHeart } from "react-icons/fi";
import { IoHeart } from "react-icons/io5";
import { IoIosListBox, IoMdListBox } from "react-icons/io";

interface Props {
    setIsHamburgerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isForMobile: boolean;
}

export const NavLinks = ({ setIsHamburgerOpen, isForMobile }: Props) => {
    const { logout } = useUser();

    const navigate = useNavigate();

    const navLinkTextStyles = "hover:underline font-extrabold";

    const onDashboardLinkClick = () => {
        setIsHamburgerOpen(false);
        console.log("!!");
        navigate("/dashboard");
    };

    const onClassesLinkClick = () => {
        setIsHamburgerOpen(false);
        navigate("/sequences");
    };

    const onFavoriteExercisesLinkClick = () => {
        setIsHamburgerOpen(false);
        navigate("/favorite-exercises");
    };

    const onLogoutLinkClick = () => {
        // setIsHamburgerOpen(false);
        logout();
    };

    return (
        <div
            className={`flex ${
                isForMobile && "flex-col items-end"
            } gap-y-4 gap-x-8`}
        >
            <Link
                to="/sequences"
                onClick={() => setIsHamburgerOpen(false)}
                className={navLinkTextStyles}
            >
                <div className="flex items-center gap-1">
                    <IoMdListBox color="#F19B51" size={20} />
                    Classes
                </div>
            </Link>
            <Link
                to="/favorite-exercises"
                onClick={() => setIsHamburgerOpen(false)}
                className={navLinkTextStyles}
            >
                <div className="flex items-center gap-1">
                    <IoHeart color="#F15A51" size={20} />
                    Favorite Exercises
                </div>
            </Link>

            <p
                onClick={logout}
                className="hover:underline bg-none border-none p-0 text-inherit font-extrabold"
            >
                Logout
            </p>
        </div>
    );
};
