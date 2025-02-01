"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputFields from "../InputFields";
import { ExpenseTypeInputs, expenseTypeSchema } from "@/lib/FormValidationSchemas";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { createExpenseType, updateExpenseType } from "@/lib/actions";
import { useRouter } from "next/navigation";

const ExpenseTypeForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: Partial<ExpenseTypeInputs>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ExpenseTypeInputs>({
        resolver: zodResolver(expenseTypeSchema),
        defaultValues: {
            id: data?.id || undefined,
            name: data?.name || "",
            description: data?.description || "",
        },
    });

    const onSubmit = async (formData: ExpenseTypeInputs) => {
        setIsSubmitting(true);
        try {
            if (type === "create") {
                await createExpenseType(formData);
                toast.success("Expense Type successfully created.");
                reset(); // Clear form after successful creation
            } else if (type === "update" && data?.id) {
                await updateExpenseType({ ...formData, id: data.id });
                toast.success("Expense Type successfully updated.");
            } else {
                throw new Error("Expense Type ID is missing for update.");
            }
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("An error occurred! Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md max-w-lg mx-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-2xl font-semibold mb-4">
                {type === "create" ? "Add Expense Type" : "Update Expense Type"}
            </h1>

            <InputFields
                label="Expense Type Name"
                name="name"
                register={register("name")}
                error={errors.name}
            />

            <InputFields
                label="Description (Optional)"
                name="description"
                register={register("description")}
                error={errors.description}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-700 transition disabled:opacity-50"
            >
                {isSubmitting
                    ? type === "create"
                        ? "Adding..."
                        : "Updating..."
                    : type === "create"
                        ? "Add Expense Type"
                        : "Update Expense Type"}
            </button>
        </form>
    );
};

export default ExpenseTypeForm;
