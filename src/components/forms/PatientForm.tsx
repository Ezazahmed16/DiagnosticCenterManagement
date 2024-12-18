"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { patientSchema, PatientSchema } from "@/lib/FormValidationSchemas";
import InputFields from "../InputFields";
import { useFormState } from "react-dom";
import { createPatient, updatePatient } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const PatientForm = ({
  type,
  data,
  setOpen
}: {
  type: "create" | "update";
  data?: Partial<PatientSchema>;
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PatientSchema>({
    resolver: zodResolver(patientSchema),
    defaultValues: data,
  });

  const [state, formAction] = useFormState(
    async (state: any, formData: PatientSchema) => {
      const result = await createPatient(formData);
      return { ...state, ...result };
    },
    { success: false, error: false }
  );


  const onSubmit = async (formData: PatientSchema) => {
    console.log("Form Submitted with Data:", formData);
    try {
      if (type === "create") {
        await createPatient(formData); 
        toast("Patient record successfully created.");
      } else {
        if (formData.id) {
          await updatePatient(formData); 
          toast("Patient record successfully updated.");
        } else {
          console.error("Patient ID is missing for update");
        }
      }
      setOpen(false);
      router.refresh(); // Refresh the page or navigate
    } catch (error) {
      toast.error("An error occurred! Please try again.");
      console.error(error);
    }
  };


  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast(`Patient record successfully ${type === "create" ? "created" : "updated"}.`);
      setOpen(false)
      // router.push("/receptionist/all-patients"); 
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Patient" : "Update Patient"}
      </h1>

      <span className="text-md text-gray-400 font-medium">
        Patient Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputFields
          label="Patient Name"
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
          label="Blood Group"
          name="bloodType"
          register={register("bloodType")}
          error={errors.bloodType}
        />
        {/* Date of Birth Selector */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="dateOfBirth" className="text-xs text-gray-500">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register("dateOfBirth")}
            className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${errors.dateOfBirth ? "ring-red-500" : "ring-gray-300"
              }`}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-red-400 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>



        {/* Gender Select Input */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="gender" className="text-xs text-gray-500">
            Gender
          </label>
          <select
            id="gender"
            className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${errors.gender ? "ring-red-400" : "ring-gray-300"
              }`}
            {...register("gender")}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && (
            <p className="text-xs text-red-400 mt-1">{errors.gender.message}</p>
          )}
        </div>

        <InputFields
          label="Address"
          name="address"
          register={register("address")}
          error={errors.address}
        />
      </div>
      {state.error && <span className="text-red-500">An error occurred! The phone number might already exist.</span>}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PatientForm;
