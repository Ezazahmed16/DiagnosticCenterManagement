"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { referredBySchema, ReferredBySchema } from "@/lib/FormValidationSchemas";
import InputFields from "../InputFields";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createReferredBy, updateReferredBy } from "@/lib/actions";

const ReferralForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: Partial<ReferredBySchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReferredBySchema>({
    resolver: zodResolver(referredBySchema),
    defaultValues: data,
  });

  const router = useRouter();

  const onSubmit = async (formData: any) => {
    // console.log("Form Submitted with Data:", formData);
    // alert("Form Submitted! Check the console for data.");

    try {
      if (type === "create") {
        await createReferredBy(formData); 
        toast.success("Referral successfully created.");
      } else if (formData.id) {
        await updateReferredBy(formData);
        toast.success("Referral successfully updated.");
      } else {
        console.error("Referral ID is missing for update");
      }
      setOpen(false); // Close the modal
      reset(); // Reset the form
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred! Please try again.");
    }
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form is being submitted");
        handleSubmit(onSubmit)(e);
      }}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Referral" : "Update Referral"}
      </h1>

      <span className="text-md text-gray-400 font-medium">
        Referral Information
      </span>

      <div className="grid grid-cols-3 justify-between flex-wrap gap-4">
        <InputFields
          label="Referral Name"
          name="name"
          register={register("name")}
          error={errors.name}
        />
        <InputFields
          label="Phone"
          name="phone"
          register={register("phone")}
          error={errors.phone}
        />
        <InputFields
          label="Commission Percent"
          name="commissionPercent"
          register={register("commissionPercent", { valueAsNumber: true })}
          error={errors.commissionPercent}
        />
        {data && (
          <InputFields
            label="Id"
            name="id"
            register={register("id")}
            error={errors.id}
          />
        )}
      </div>

      {Object.keys(errors).length > 0 && (
        <span className="text-red-500">
          {Object.values(errors).map((err, idx) => (
            <div key={idx}>{err?.message}</div>
          ))}
        </span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ReferralForm;