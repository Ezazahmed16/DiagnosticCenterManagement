"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFields from "../InputFields";

const schema = z.object({
    expenseTitle: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long!" })
        .max(50, { message: "Title must be at most 50 characters long!" }),
    expenseAmount: z
        .preprocess(
            (val) => (typeof val === "string" && val.trim() !== "" ? Number(val) : undefined),
            z.number({ invalid_type_error: "Amount must be a valid number!" })
        )
        .refine((val) => val >= 1, { message: "Amount must be at least 1!" })
        .refine((val) => val <= 100000, { message: "Amount must not exceed 100,000!" }),
    expenseCategory: z.enum(["Rent", "Utilities", "Miscellaneous"], {
        required_error: "Category is required!",
    }),
    description: z
        .string()
        .max(100, { message: "Description must not exceed 100 words!" })
        .optional(),
});


type Inputs = z.infer<typeof schema>;

const ExpenseForm = ({
    type,
    data,
}: {
    type: "create" | "update";
    data?: Partial<Inputs>;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: data || {}, // Provide a fallback for default values
    });

    const onSubmit = (formData: Inputs) => {
        console.log("Form Submitted:", formData);
        alert(`Expense ${type === "create" ? "created" : "updated"} successfully!`);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Add Expense" : "Update Expense"}
            </h1>

            {/* Expense Information Section */}
            <span className="text-xl text-gray-400 font-medium">Expense Details</span>
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <InputFields
                    label="Title"
                    name="expenseTitle"
                    register={register("expenseTitle")}
                    error={errors.expenseTitle} // Pass the entire error object
                />
                <InputFields
                    label="Amount"
                    name="expenseAmount"
                    type="number"
                    register={register("expenseAmount")}
                    error={errors.expenseAmount} // Pass the entire error object
                />
                <div className="w-full md:w-1/4">
                    <label htmlFor="expenseCategory" className="text-xs text-gray-500 block mb-1">
                        Expense Type
                    </label>
                    <select
                        id="expenseCategory"
                        className={`p-2 border rounded-md w-full ${
                            errors.expenseCategory ? "border-red-400" : "border-gray-300"
                        }`}
                        {...register("expenseCategory")}
                    >
                        <option value="">Select Type</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                    {errors.expenseCategory && (
                        <p className="text-xs text-red-400 mt-1">
                            {errors.expenseCategory.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-xs text-gray-500 text-left">
                    Description (Optional, Max 100 Words)
                </label>
                <textarea
                    id="description"
                    className={`p-2 border rounded-md w-full ${
                        errors.description ? "border-red-400" : "border-gray-300"
                    }`}
                    rows={3}
                    placeholder="Add additional details here..."
                    {...register("description")}
                ></textarea>
                {errors.description && (
                    <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
                )}
            </div>

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
