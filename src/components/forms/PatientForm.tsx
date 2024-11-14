"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFields from "../InputFields";

const schema = z.object({
  patientName: z
    .string()
    .min(3, { message: "Patient name must be at least 3 characters long!" })
    .max(20, { message: "Patient name must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone number must contain only digits!" })
    .min(10, { message: "Phone number must be at least 10 digits long!" }),
  age: z
    .preprocess(
      (val) => (val !== null && val !== "" ? Number(val) : undefined),
      z.number().min(1, { message: "Age must be at least 1!" }).max(120, { message: "Age must be at most 120!" })
    ),
  gender: z.enum(["male", "female", "other"], { message: "Gender is required!" }),
  address: z.string().min(5, { message: "Address is required!" }),
});

type Inputs = z.infer<typeof schema>;

const PatientForm = ({
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
    defaultValues: data,
  });

  const onSubmit = (formData: Inputs) => {
    // Debugging: Log formData to see if data is being passed correctly
    console.log("Form Submitted with Data:", formData);

    // Simulate an action (e.g., API call or state update)
    alert(`Form submitted successfully! Data: ${JSON.stringify(formData)}`);
  };

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
          name="patientName"
          register={register("patientName")}
          error={errors.patientName}
        />
        <InputFields
          label="Email"
          name="email"
          register={register("email")}
          error={errors.email}
        />
        <InputFields
          label="Phone"
          name="phone"
          register={register("phone")}
          error={errors.phone}
        />
        <InputFields
          label="Age"
          name="age"
          register={register("age")}
          error={errors.age}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gender")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">{errors.gender.message}</p>
          )}
        </div>
        <InputFields
          label="Address"
          name="address"
          register={register("address")}
          error={errors.address}
        />
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PatientForm;
