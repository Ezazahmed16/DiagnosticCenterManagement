"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import InputFields from "../InputFields";
import { MdCancelPresentation } from "react-icons/md";

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
  paidAmount: z
    .number()
    .min(0, { message: "Paid amount cannot be negative!" })
    .max(1000000, { message: "Paid amount is too large!" })
    .optional(),
});

type Inputs = z.infer<typeof schema>;

// Dummy data for test options
const testOptions = [
  { id: 1, name: "Blood Test", cost: 50 },
  { id: 2, name: "X-Ray", cost: 100 },
  { id: 3, name: "MRI", cost: 500 },
  { id: 4, name: "CT Scan", cost: 300 },
];

const MemoForm = ({
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
    setValue,
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [selectedTests, setSelectedTests] = useState<
    { id: number; name: string; cost: number }[]
  >([]);

  const handleAddTest = (testId: number) => {
    const selectedTest = testOptions.find((test) => test.id === testId);
    if (selectedTest && !selectedTests.some((test) => test.id === testId)) {
      setSelectedTests((prev) => [...prev, selectedTest]);
    }
  };

  const handleRemoveTest = (testId: number) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== testId));
  };

  const totalCost = selectedTests.reduce((sum, test) => sum + test.cost, 0);
  const paidAmount = watch("paidAmount") || 0;  // Get the paid amount value
  const dueAmount = totalCost - paidAmount;
  const paymentStatus = dueAmount > 0 ? "Due" : "Paid";

  // Ensuring the due amount doesn't go negative
  const finalDueAmount = dueAmount > 0 ? dueAmount : 0;

  // Calculate the returnable amount if any
  const returnableAmount = paidAmount > totalCost ? paidAmount - totalCost : 0;

  const onSubmit = (formData: Inputs) => {
    console.log("Form Submitted with Data:", formData);
    console.log("Selected Tests:", selectedTests);
    console.log("Total Cost:", totalCost);
    console.log("Paid Amount:", paidAmount);
    console.log("Due Amount:", finalDueAmount);
    console.log("Payment Status:", paymentStatus);
    alert(`Form Submitted. Total Cost: $${totalCost}. Status: ${paymentStatus}`);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Memo" : "Update Memo"}
      </h1>

      <span className="text-xl text-gray-400 font-medium">
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

      <span className="text-xl text-gray-400 font-medium">Test Information</span>

      <div className="flex flex-row justify-between items-start gap-2">
        {/* Select Test Dropdown */}
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-medium text-gray-500">Select Test</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            onChange={(e) => handleAddTest(Number(e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>
              Select a Test
            </option>
            {testOptions.map((test) => (
              <option key={test.id} value={test.id}>
                {test.name} - ${test.cost}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Tests */}
        <div className="flex flex-col w-2/3">
          <label className="text-sm font-medium text-gray-500">
            Selected Tests
          </label>
          <div className="flex flex-col gap-2 border p-4 rounded-md">
            {selectedTests.length > 0 ? (
              selectedTests.map((test) => (
                <div
                  key={test.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{test.name}</span>
                  <span>${test.cost}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(test.id)}
                    className="text-red-400 text-xs"
                  >
                    <MdCancelPresentation />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-xs">
                No tests selected yet.
              </span>
            )}

            {/* Total Cost */}
            <div className="flex flex-col text-sm font-medium">
              <span>Total Amount: ${totalCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <span className="text-xl text-gray-400 font-medium">Payment Information</span>
      <div className="flex flex-wrap gap-2">
        <InputFields
          label="Paid Amount"
          name="paidAmount"
          type="number"
          register={register("paidAmount")}
          error={errors.paidAmount}
        />
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium text-gray-500">Due Amount</label>
          <input
            type="text"
            value={finalDueAmount}
            readOnly
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium text-gray-500">Returnable Amount</label>
          <input
            type="text"
            value={returnableAmount > 0 ? returnableAmount : 0}
            readOnly
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium text-gray-500">Payment Status</label>
          <input
            type="text"
            value={paymentStatus}
            readOnly
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        {type === "create" ? "Create Memo" : "Update Memo"}
      </button>
    </form>
  );
};

export default MemoForm;

