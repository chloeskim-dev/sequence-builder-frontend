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
        <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items gap-y-8">
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
        // <div className="h-full bg-white">
        //     <div className="h-full flex flex-col bg-yellow-100 py-2">
        //         <div className="flex-1 overflow-y-auto">
        //             <div>content</div>
        //
        //         </div>
        //         <div className="flex-shrink-0 py-2">buttons</div>
        //     </div>
        // </div>
    );
};

export default DashboardPage;
