import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputFields from "../InputFields";
import { AssetInputs, assetSchema } from "@/lib/FormValidationSchemas";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createAsset, updateAsset } from "@/lib/actions";
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";

// Form Component
const AssetsForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: Partial<AssetInputs>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm<AssetInputs>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            ...data,
            amount: data?.amount ? parseFloat(data.amount.toString()) : 0,
            qty: data?.qty ? parseInt(data.qty.toString(), 10) : 1,

        },
    });

    // Image Upload
    const [image, setImage] = useState<any>();

    // Watch amount and qty fields
    const amount = watch("amount");
    const qty = watch("qty");

    // Calculate value as amount * qty
    const value = amount * qty;

    // Dynamically set the calculated value (amount * qty) in the form
    if (value !== undefined) {
        setValue("value", value); // Update the value field dynamically
    }

    const router = useRouter();

    const onSubmit = async (formData: AssetInputs) => {
        console.log('Form data:', formData);  // Log the actual form data

        try {
            if (type === "create") {
                await createAsset(formData);
                toast.success("Test record successfully created.");
            } else if (type === "update" && formData.id) {
                if (formData.id) {
                    await updateAsset({ ...formData, id: formData.id as string });
                } else {
                    throw new Error("Test ID is missing for update.");
                }
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
                {type === "create" ? "Add Asset" : "Update Asset"}
            </h1>

            {/* Asset Information Section */}
            <div className="grid grid-cols-4 gap-4 justify-between items-center">
                {
                    data && (
                        <InputFields
                            label="ID"
                            name="id"
                            register={register("id")}
                            error={errors.id}
                            hidden
                        />
                    )}
                <InputFields
                    label="Asset Name"
                    name="name"
                    register={register("name")}
                    error={errors.name}
                />
                <InputFields
                    label="Amount"
                    name="amount"
                    type="number"
                    register={register("amount", {
                        setValueAs: (v) => parseFloat(v) || 0, // Ensure amount is parsed as a number
                    })}
                    error={errors.amount}
                />
                <InputFields
                    label="Quantity"
                    name="qty"
                    type="number"
                    register={register("qty", {
                        setValueAs: (v) => parseInt(v, 10) || 1, // Ensure qty is parsed as an integer
                    })}
                    error={errors.qty}
                />
                {/* Total Amount (calculated dynamically based on amount * qty) */}
                <InputFields
                    label="Total Amount"
                    name="value"
                    type="number"
                    register={register("value")}
                    error={errors.value}
                    disabled
                />
            </div>

            {/* Purchased By */}
            <InputFields
                label="Purchased By"
                name="purchasedBy"
                register={register("purchasedBy")}
                error={errors.purchasedBy}
            />

            <div className="grid grid-cols-2 gap-4 justify-between items-center">
                <CldUploadWidget
                    uploadPreset="AlokHealthCare"
                    onSuccess={(result: any, { widget }) => {
                        if (result?.info?.secure_url) {
                            setImage(result.info.secure_url);
                            setValue("img", result.info.secure_url);
                        }
                        widget.close();
                        console.log(result);
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            className="flex flex-row gap-2 w-full md:w-2/4 justify-center btn bg-gray-200 text-black p-2 rounded-md font-bold items-center"
                            onClick={() => open()}
                        >
                            <Image src="/upload.png" alt="Upload" width={32} height={32} />
                            <span>Upload a photo</span>
                        </button>
                    )}
                </CldUploadWidget>

                {/* Display uploaded image */}
                <div className="">
                    {image && (
                        <div className="w-32 h-32 mt-4">
                            <Image src={image} alt="Uploaded Image" width={128} height={128} className="rounded-md" />
                        </div>
                    )}
                    {
                        type === "update" && data?.img && (
                            <div className="w-32 h-32 mt-4">
                                <Image src={data?.img} alt="Uploaded Image" width={128} height={128} className="rounded-md" />
                            </div>
                        )
                    }
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
            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default AssetsForm;
