import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FiList } from "react-icons/fi"; // common and clear

const DashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center">
            <div className="mt-4 flex w-[300px] flex-col gap-y-4">
                <button
                    onClick={() => navigate("/sequences")}
                    className="bg-blue-600 text-white font-bold px-4 py-2 flex items-center justify-center gap-2"
                >
                    My Sequences
                    <FiList size={18} />
                </button>

                <button
                    onClick={() => navigate("/favorite-exercises")}
                    className="bg-blue-600 text-white font-bold px-4 py-2 flex items-center justify-center gap-2"
                >
                    My Favorite Exercises
                    <FiHeart fill="red" color="red" size={18} />
                </button>
            </div>{" "}
        </div>
    );
};

export default DashboardPage;
