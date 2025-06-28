import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const NavLinks = () => {
  const { logout } = useUser();

  return (
    <>
      <Link to="/dashboard" className="hover:underline">
        Dashboard
      </Link>
      <Link to="/settings" className="hover:underline">
        Settings
      </Link>
      <Link to="/help" className="hover:underline">
        Help
      </Link>
      <button
        onClick={logout}
        className="hover:underline text-left bg-none border-none p-0 text-inherit"
      >
        Logout
      </button>
    </>
  );
};
