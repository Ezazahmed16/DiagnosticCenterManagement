"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { performedBySchema, PerformedBySchema } from "@/lib/FormValidationSchemas";
import InputFields from "../InputFields";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createPerformedBy, updatePerformedBy } from "@/lib/actions";

const PerformersForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: Partial<PerformedBySchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PerformedBySchema>({
    resolver: zodResolver(performedBySchema),
    defaultValues: {
      ...data,
      totalPerformed: data?.totalPerformed ?? 0,
      totalAmount: data?.totalAmount ?? 0,
      dueAmount: data?.dueAmount ?? 0,
      payable: data?.payable ?? 0,
    },
  });

  console.log(relatedData)

  const router = useRouter();

  const onSubmit = async (formData: PerformedBySchema) => {
    try {
      if (type === "create") {
        const result = await createPerformedBy(formData); // Ensure create API function exists
        if (result.success) {
          toast.success("Performer successfully created.");
        } else {
          throw new Error("Error creating performer.");
        }
      } else if (type === "update" && formData.id) {
        const result = await updatePerformedBy(formData); // Ensure update API function exists
        if (result.success) {
          toast.success("Performer successfully updated.");
        } else {
          throw new Error("Error updating performer.");
        }
      } else {
        throw new Error("Invalid data or missing ID for update.");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred! Please try again.");
      console.error(error);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Performer" : "Update Performer"}
      </h1>

      <span className="text-md text-gray-400 font-medium">Performer Information</span>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-4">
          {/* Name Input */}
          <InputFields
            label="Performer Name"
            name="name"
            register={register("name")}
            error={errors.name}
          />
          {/* Phone Input */}
          <InputFields
            label="Phone"
            name="phone"
            register={register("phone")}
            error={errors.phone}
          />
          {/* Commission Input */}
          <InputFields
            label="Commission (%)"
            name="commission"
            register={register("commission", { valueAsNumber: true })}
            error={errors.commission}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* Total Performed Input */}
          <InputFields
            label="Total Performed Tests"
            name="totalPerformed"
            register={register("totalPerformed", { valueAsNumber: true })}
            error={errors.totalPerformed}
          />
          {/* Total Amount Input */}
          <InputFields
            label="Total Amount"
            name="totalAmount"
            register={register("totalAmount", { valueAsNumber: true })}
            error={errors.totalAmount}
          />
          {/* Due Amount Input */}
          <InputFields
            label="Due Amount"
            name="dueAmount"
            register={register("dueAmount", { valueAsNumber: true })}
            error={errors.dueAmount}
          />
        </div>
        {/* Payable Input */}
        <InputFields
          label="Payable Amount"
          name="payable"
          register={register("payable", { valueAsNumber: true })}
          error={errors.payable}
        />
        {/* Hidden ID Field (For Update Only) */}
        {data && data.id && (
          <input
            type="hidden"
            {...register("id")}
          />
        )}
      </div>

      {/* Display Validation Errors */}
      {errors && (
        <div className="text-red-500">
          {Object.values(errors).map((err, index) => (
            <div key={index}>{err?.message}</div>
          ))}
        </div>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PerformersForm;