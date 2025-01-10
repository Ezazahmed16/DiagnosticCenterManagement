'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import dynamic from "next/dynamic";
import { deleteExpense, deleteMemo, deletePatient, deletePerformedBy, deleteReferredBy, deleteTest } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PerformersForm from "./forms/PerformerForm";

// Lazy load form components
const MemoForm = dynamic(() => import("./forms/MemoForm"), { loading: () => <h1>Loading...</h1> });
const PatientForm = dynamic(() => import("./forms/AddPatientForm"), { loading: () => <h1>Loading...</h1> });
const ExpenseForm = dynamic(() => import("./forms/ExpenseForm"), { loading: () => <h1>Loading...</h1> });
const AddTestForm = dynamic(() => import("./forms/AddTestForm"), { loading: () => <h1>Loading...</h1> });
const ReferalForm = dynamic(() => import("./forms/ReferalForm"), { loading: () => <h1>Loading...</h1> });
const PerformerData = dynamic(() => import("./forms/PerformerForm"), { loading: () => <h1>Loading...</h1> });
// const ExpenseTypeForm = dynamic(() => import("./forms/ExpenseTypeForm "), { loading: () => <h1>Loading...</h1> });
// const AssetsForm = dynamic(() => import("./forms/AssetsForm"), { loading: () => <h1>Loading...</h1> });
// const AddRoleForm = dynamic(() => import("./forms/AddRole"), { loading: () => <h1>Loading...</h1> });


const deleteActionMap: {
    [key: string]: (formData: FormData) => Promise<{ success: boolean; error: boolean }>
} = {
    patientData: deletePatient,
    testData: deleteTest,
    PerformerData: deletePerformedBy,
    memoData: deleteMemo,
    ReferalData: deleteReferredBy
};

// Define form components based on table
const forms: {
    [key: string]: (
        type: "create" | "update",
        data: any,
        setOpen: Dispatch<SetStateAction<boolean>>,
        relatedData?: any
    ) => JSX.Element;
} = {
    patientData: (type, data, setOpen) =>
        <PatientForm type={type} data={data} setOpen={setOpen} />,
    PerformerData: (type, data, setOpen, relatedData) =>
        <PerformersForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    testData: (type, data, setOpen, relatedData) =>
        <AddTestForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    memoData: (type, data, setOpen, relatedData) =>
        <MemoForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    ExpenseData: (type, data, setOpen, relatedData) =>
        <ExpenseForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    ReferalData: (type, data, setOpen) =>
        <ReferalForm type={type} data={data} setOpen={setOpen} />,
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
    | "User Data"
    | "ExpenseType"
    | "PerformerData"
    | "AssetsData"
    | "ReferalData";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string;
    relatedData?: any;
};

const FormModal = ({ table, type, data, id, relatedData }: FormModalProps) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Handle delete action
    const handleDelete = async (id: string) => {
        if (!id) {
            toast.error("Invalid ID for deletion.");
            return;
        }

        const deleteAction = deleteActionMap[table];
        if (!deleteAction) {
            toast.error("Delete action not supported for this table.");
            return;
        }

        // Create FormData and append the id for deletion
        const formData = new FormData();
        formData.append("id", id);

        const result = await deleteAction(formData);
        if (result.success) {
            toast("Item deleted successfully.");
            setOpen(false);
            router.refresh();
        } else {
            toast.error("Failed to delete the item.");
        }
    };

    // Form component to render based on type ( create, update, delete)
    const Form = () => {
        if (type === "delete" && id) {
            return (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete(id);
                    }}
                    className="p-4 flex flex-col gap-4"
                >
                    <span className="text-center font-medium">
                        Are you sure you want to delete this {table}?
                    </span>
                    <button
                        type="submit"
                        className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
                    >
                        Delete
                    </button>
                </form>
            );
        }

        if (type === "create" || type === "update") {
            const renderForm = forms[table];
            if (!renderForm) {
                return <span>Form Not Found!</span>;
            }
            return renderForm(type, data, setOpen, relatedData);
        }

        return <span>Form Not Found!</span>;
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full`}
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
                    <div className="bg-white text-black p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[50%] max-h-[80%] overflow-y-auto">
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
