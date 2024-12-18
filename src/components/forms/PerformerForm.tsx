"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { performedBySchema, PerformedBySchema } from "@/lib/FormValidationSchemas";
import InputFields from "../InputFields";
// import { createPerformedBy, updatePerformedBy } from "@/lib/actions"; 
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createPerformedBy, updatePerformedBy } from "@/lib/actions";

const PerformersForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: Partial<PerformedBySchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PerformedBySchema>({
    resolver: zodResolver(performedBySchema),
    defaultValues: data,
  });

  const router = useRouter();

  const onSubmit = async (formData: PerformedBySchema) => {
    console.log("Form Submitted with Data:", formData);
    try {
      if (type === "create") {
        await createPerformedBy(formData); // Ensure the API function exists
        toast.success("Performer successfully created.");
      } else {
        if (formData.id) {
          await updatePerformedBy(formData); // Ensure the API function exists
          toast.success("Performer successfully updated.");
        } else {
          console.error("Performer ID is missing for update");
        }
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

      <div className="flex justify-between flex-wrap gap-4">
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
        {
          data && 
          <InputFields
            label="Id"
            name="id"
            register={register("id")}
            error={errors.id}
            hidden
          /> 
        }       
      </div>

      {errors && (
        <span className="text-red-500">
          {Object.values(errors).map((err) => (
            <div key={err?.message}>{err?.message}</div>
          ))}
        </span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PerformersForm;
