import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit, FaPlus } from "react-icons/fa";
import { LuView } from "react-icons/lu";

type FormModalProps = {
    table: "account" | "receptionist" | "patientData" | "memoData" | "testData" | "patient" | "ExpenseData" | "UserData" | "ReferalData"; 
    type: "create" | "update" | "delete";
    data?: any;
    id?: number;
};

const FormModal = ({ table, type, data, id }: FormModalProps) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor =
        type === "create"
            ? ""
            : type === "update"
                ? ""
                : "";

    return (
        <>
            <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`}>
                {type === "create" ? (
                    <FaPlus size={18} />
                ) : type === "delete" ? (
                    <AiOutlineDelete size={18} />
                ) : (
                    <FaEdit size={18} />
                )}
            </button>
        </>
    );
};

export default FormModal;
