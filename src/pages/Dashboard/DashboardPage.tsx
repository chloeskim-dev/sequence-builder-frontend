import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FiList } from "react-icons/fi"; // common and clear
import { useUser } from "../../contexts/UserContext";
import { dashboardButtonTextStyles } from "../../constants/tailwindClasses";

const DashboardPage = () => {
    const navigate = useNavigate();

    const { user } = useUser();
    const userId = user?.id ?? null;
    return (
        <div className="flex justify-center mt-8">
            <div className="mt-4 flex flex-col gap-y-4">
                <button
                    onClick={() => navigate("/sequences")}
                    className={dashboardButtonTextStyles}
                >
                    <FiList size={16} />
                    My Sequences
                </button>
                <button
                    onClick={() => navigate("/favorite-exercises")}
                    className={dashboardButtonTextStyles}
                >
                    <FiHeart fill="red" color="red" size={14} />
                    My Favorite Exercises
                </button>
            </div>{" "}
        </div>
    );
};

export default DashboardPage;
