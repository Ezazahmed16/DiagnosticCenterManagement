"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFields from "../InputFields";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";

const schema = z.object({
    assetsTitle: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long!" })
        .max(50, { message: "Title must be at most 50 characters long!" }),
    purchaseAmount: z
        .preprocess(
            (val) => (typeof val === "string" && val.trim() !== "" ? Number(val) : undefined),
            z.number({ invalid_type_error: "Amount must be a valid number!" })
        )
        .refine((val) => val >= 1, { message: "Amount must be at least 1!" })
        .refine((val) => val <= 100000, { message: "Amount must not exceed 100,000!" }),
    purchaseQty: z
        .preprocess(
            (val) => (typeof val === "string" && val.trim() !== "" ? Number(val) : undefined),
            z.number({ invalid_type_error: "Quantity must be a valid number!" })
        )
        .refine((val) => val >= 1, { message: "Quantity must be at least 1!" }),
    purchaseBy: z
        .string()
        .min(3, { message: "Purchaser name must be at least 3 characters long!" })
        .max(50, { message: "Purchaser name must be at most 50 characters long!" }),
    img: z
        .custom<File | undefined>((val) => val instanceof File || val === undefined, {
            message: "Please upload a valid document!",
        })
        .optional(),
    description: z
        .string()
        .max(100, { message: "Description must not exceed 100 characters!" })
        .optional(),
});

type Inputs = z.infer<typeof schema>;

const AssetsForm = ({
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
        defaultValues: data || {},
    });

    const onSubmit = (formData: Inputs) => {
        console.log("Form Submitted:", formData);
        alert(`Asset ${type === "create" ? "created" : "updated"} successfully!`);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Add Asset" : "Update Asset"}
            </h1>

            {/* Asset Information Section */}
            <span className="text-xl text-gray-400 font-medium">Asset Details</span>
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <InputFields
                    label="Title"
                    name="assetsTitle"
                    register={register("assetsTitle")}
                    error={errors.assetsTitle}
                />
                <InputFields
                    label="Amount"
                    name="purchaseAmount"
                    type="number"
                    register={register("purchaseAmount")}
                    error={errors.purchaseAmount}
                />
                <InputFields
                    label="Quantity"
                    name="purchaseQty"
                    type="number"
                    register={register("purchaseQty")}
                    error={errors.purchaseQty}
                />
                <InputFields
                    label="Purchased By"
                    name="purchaseBy"
                    register={register("purchaseBy")}
                    error={errors.purchaseBy}
                />
                
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                        htmlFor="img"
                    >
                        <Image src="/upload.png" alt="Upload" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" id="img" {...register("img")} className="hidden" />
                </div>
            </div>



            {/* Description */}
            <InputFields
                label="Description (Optional)"
                name="description"
                type="text"
                register={register("description")}
                error={errors.description}
            />

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition"
            >
                {type === "create" ? "Add Asset" : "Update Asset"}
            </button>
        </form>
    );
};

export default AssetsForm;
