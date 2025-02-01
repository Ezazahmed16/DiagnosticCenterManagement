"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputFields from "../InputFields";
import { expenseSchema, ExpenseSchema } from "@/lib/FormValidationSchemas";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { createExpense, updateExpense } from "@/lib/actions";
import { useRouter } from "next/navigation";

const ExpenseForm = ({
    type,
    data,
    setOpen,
    relatedData = { expenseTypes: [] },
}: {
    type: "create" | "update";
    data?: Partial<ExpenseSchema>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: { expenseTypes: { id: string; name: string }[] };
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ExpenseSchema>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            ...data,
            date: data?.date ? new Date(data.date) : new Date(),
        }
    });

    const router = useRouter();

    const onSubmit = async (formData: ExpenseSchema) => {
        console.log(formData);
        try {
            if (type === "create") {
                await createExpense(formData);
                toast.success("Test record successfully created.");
            } else if (type === "update" && formData.id) {
                await updateExpense(formData);
                toast.success("Test record successfully updated.");
            } else {
                throw new Error("Test ID is missing for update.");
            }
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("An error occurred! Please try again.");
            console.error(error);
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Add Expense" : "Update Expense"}
            </h1>

            <span className="text-xl text-gray-400 font-medium">Expense Details</span>
            <div className="grid grid-cols-3 gap-4">
                {data && (
                    <InputFields
                        label="ID"
                        name="id"
                        register={register("id")}
                        error={errors.id}
                        hidden
                    />
                )}

                <InputFields
                    label="Title"
                    name="title"
                    register={register("title")}
                    error={errors.title}
                />

                <InputFields
                    label="Amount"
                    name="amount"
                    type="number"
                    register={register("amount", { valueAsNumber: true })}
                    error={errors.amount}
                />

                <div>
                    <label className="text-xs text-gray-500">Expense Type</label>
                    <select
                        className={`p-2 border rounded-md w-full ${errors.expenseTypeId ? "border-red-400" : "border-gray-300"
                            }`}
                        {...register("expenseTypeId")}
                    >
                        <option value="">Select Type</option>
                        {relatedData.expenseTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    {errors.expenseTypeId && (
                        <p className="text-xs text-red-400">
                            {errors.expenseTypeId.message}
                        </p>
                    )}
                </div>

                <InputFields
                    label="Date"
                    name="date"
                    type="date"
                    register={register("date")}
                    error={errors.date}
                />
            </div>

            <div>
                <label className="text-xs text-gray-500">Description (Optional)</label>
                <textarea
                    className={`p-2 border rounded-md w-full ${errors.description ? "border-red-400" : "border-gray-300"
                        }`}
                    rows={3}
                    placeholder="Add details..."
                    {...register("description")}
                ></textarea>
                {errors.description && (
                    <p className="text-xs text-red-400">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition"
            >
                {type === "create" ? "Add Expense" : "Update Expense"}
            </button>
        </form>
    );
};

export default ExpenseForm;
