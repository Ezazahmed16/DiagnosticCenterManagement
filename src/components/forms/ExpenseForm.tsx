"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputFields from "../InputFields";
import { expenseSchema, ExpenseSchema } from "@/lib/FormValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { createExpense, updateExpense } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

const ExpenseForm = ({
    type,
    data,
    setOpen,
    relatedData = { expenseTypes: [] }, // Set a default empty array
}: {
    type: "create" | "update";
    data?: Partial<ExpenseSchema>;
    setOpen: Dispatch<SetStateAction<boolean>>
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<ExpenseSchema>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            ...data,
            expenseTypeId: data?.expenseTypeId || "",  // Make sure it's an empty string if undefined
            description: data?.description || "",  // Default empty string if undefined        },
    },
    });



// const onSubmit = async (formData: any) => {
//     console.log(formData);
//     // try {
//     //     if (type === "create") {
//     //         const result = await createExpense(formData);
//     //         if (result.success) {
//     //             toast.success("Expense created successfully!");
//     //         } else {
//     //             toast.error("Failed to create expense.");
//     //         }
//     //     } else if (type === "update") {
//     //         const result = await updateExpense(formData);
//     //         if (result.success) {
//     //             toast.success("Expense updated successfully!");
//     //         } else {
//     //             toast.error("Failed to update expense.");
//     //         }
//     //     }
//     //     setOpen(false); // Close the form modal after submission
//     // } catch (error) {
//     //     console.error("Error submitting form:", error);
//     //     toast.error("An error occurred while submitting the form.");
//     // }
// };

const onSubmit = async (formData: any) => {
    console.log("Form submitted with data: ", formData);

    try {
        if (type === "create") {
            const result = await createExpense(formData);  // Ensure createExpense is async
            if (result.success) {
                toast.success("Expense created successfully!");
            } else {
                toast.error("Failed to create expense.");
            }
        } else {
            const result = await updateExpense(formData);  // Ensure updateExpense is async
            if (result.success) {
                toast.success("Expense updated successfully!");
            } else {
                toast.error("Failed to update expense.");
            }
        }
        setOpen(false); // Close modal after submission
    } catch (error) {
        console.error("Error during form submission:", error);
        toast.error("An error occurred while submitting the form.");
    }
};




return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-semibold">
            {type === "create" ? "Add Expense" : "Update Expense"}
        </h1>

        {/* Expense Information Section */}
        <span className="text-xl text-gray-400 font-medium">Expense Details</span>
        <div className="flex flex-wrap gap-4 justify-between items-center">
            {
                data && <InputFields
                    label="id"
                    name="id"
                    register={register("id")}
                    error={errors.id} // Pass the entire error object
                />
            }
            <InputFields
                label="Title"
                name="title"
                register={register("title")}
                error={errors.title} // Pass the entire error object
            />
            <InputFields
                label="Amount"
                name="amount"
                type="number"
                register={register("amount")}
                error={errors.amount} // Pass the entire error object
            />
            <div className="w-full md:w-1/4">
                <label htmlFor="expenseCategory" className="text-xs text-gray-500 block mb-1">
                    Expense Type
                </label>
                <select
                    id="expenseCategory"
                    className={`p-2 border rounded-md w-full ${errors.expenseTypeId ? "border-red-400" : "border-gray-300"
                        }`}
                    {...register("expenseTypeId")}
                >
                    <option value="">Select Type</option>
                    {relatedData?.expenseTypes && Array.isArray(relatedData.expenseTypes)
                        ? relatedData.expenseTypes.map((type: any) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))
                        : null}
                </select>

                {errors.expenseTypeId && (
                    <p className="text-xs text-red-400 mt-1">
                        {errors.expenseTypeId.message}
                    </p>
                )}
            </div>

        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-xs text-gray-500 text-left">
                Description (Optional, Max 100 Characters)
            </label>
            <textarea
                id="description"
                className={`p-2 border rounded-md w-full ${errors.description ? "border-red-400" : "border-gray-300"}`}
                rows={3}
                placeholder="Add additional details here..."
                {...register("description")}
            ></textarea>
            {errors.description && (
                <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
            )}
        </div>

        {/* {state.error && <span className="text-red-500">An error occurred! The phone number might already exist.</span>} */}

        {/* Submit Button */}
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