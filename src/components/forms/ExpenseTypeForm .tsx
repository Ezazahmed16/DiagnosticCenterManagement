"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFields from "../InputFields";

const schema = z.object({
    expenseTypeTitle: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long!" })
        .max(50, { message: "Title must be at most 50 characters long!" }),
});

type Inputs = z.infer<typeof schema>;

const ExpenseTypeForm = ({
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
        // Add actual API call logic here.
    };

    return (
        <form
            className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md max-w-lg mx-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-2xl font-semibold mb-4">
                {type === "create" ? "Add Expense Type" : "Update Expense Type"}
            </h1>

            {/* Title Input */}
            <InputFields
                label="Expense Tupe"
                name="expenseTypeTitle"
                register={register("expenseTypeTitle")}
                error={errors.expenseTypeTitle}
            />

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-700 transition"
            >
                {type === "create" ? "Add Expense Type" : "Update Expense Type"}
            </button>
        </form>
    );
};

export default ExpenseTypeForm;
