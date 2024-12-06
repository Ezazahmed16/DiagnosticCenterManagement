'use client';
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import MemoForm from "./forms/MemoForm";
import PatientForm from "./forms/PatientForm";
import ExpenseForm from "./forms/ExpenseForm";
import ExpenseTypeForm from "./forms/ExpenseTypeForm ";
import AssetsForm from "./forms/AssetsForm";
import AddRoleForm from "./forms/AddRole";

const forms: {
    [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
    patientData: (type, data) => <PatientForm type={type} data={data} />,
    memoData: (type, data) => <MemoForm type={type} data={data} />,
    ExpenseData: (type, data) => <ExpenseForm type={type} data={data} />,
    ExpenseType: (type, data) => <ExpenseTypeForm type={type} data={data} />,
    AssetsData: (type, data) => <AssetsForm type={type} data={data} />,
    UserData: (type, data) => <AddRoleForm type={type} data={data} />,
};


type FormModalProps = {
    table:
        | "account"
        | "receptionist"
        | "patientData"
        | "memoData"
        | "testData"
        | "patient"
        | "ExpenseData"
        | "UserData"
        | "ExpenseType"
        | "AssetsData"
        | "ReferalData";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string;
};

const FormModal = ({ table, type, data, id }: FormModalProps) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor = type === "create"
        ? ""
        : type === "update"
            ? ""
            : "";

    const [open, setOpen] = useState(false);

    const Form = () => {
        return type === "delete" && id ? (
            <form action="" className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">
                    Are you sure you want to delete this {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Delete
                </button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](type, data)
        ) : "Form Not Found!"
    };

    return (
        <>
            <button
                className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
                onClick={() => setOpen(true)}
            >
                {type === "create" ? (
                    <FaPlus size={18} />
                ) : type === "delete" ? (
                    <AiOutlineDelete size={18} />
                ) : (
                    <FaEdit size={18} />
                )}
            </button>
            {open && (
                <div className="w-full h-full fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div
                        className="bg-white text-black p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90%] overflow-y-auto"
                    >
                        <button
                            className="absolute top-4 right-4 cursor-pointer text-gray-700"
                            onClick={() => setOpen(false)}
                        >
                            <IoMdCloseCircle size={24} />
                        </button>
                        <Form />
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;
