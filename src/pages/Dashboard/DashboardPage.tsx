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
            <div className="mt-[20vh] flex flex-col items-center gap-y-4">
                <button
                    onClick={() => navigate("/sequences")}
                    className={dashboardButtonTextStyles}
                >
                    <FiList size={18} />
                    My Sequences
                </button>
                <button
                    onClick={() => navigate("/favorite-exercises")}
                    className={dashboardButtonTextStyles}
                >
                    <FiHeart fill="#ea6962" color="#ea6962" size={16} />
                    My Favorite Exercises
                </button>
            </div>{" "}
        </div>
    );
};

export default DashboardPage;
