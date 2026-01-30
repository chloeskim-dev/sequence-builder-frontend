import { responsiveTextStyles } from "../../constants/tailwindClasses";
import { GrInfo } from "react-icons/gr";
const HintText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <p
            className={`my-2 w-[80%] mx-auto text-gray-500 text-center italic font-semibold ${responsiveTextStyles}`}
        >
            {children}
        </p>
    );
};

export default HintText;
