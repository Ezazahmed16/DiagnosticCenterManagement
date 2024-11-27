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
      z
        .number()
        .min(1, { message: "Age must be at least 1!" })
        .max(120, { message: "Age must be at most 120!" })
    ),
  gender: z.enum(["male", "female", "other"], { message: "Gender is required!" }),
  address: z.string().min(5, { message: "Address is required!" }),
  paidAmount: z
    .preprocess((val) => (val !== null && val !== "" ? Number(val) : undefined), z.number())
    .optional(),
  dueAmount: z.number().optional(),
  memoTest: z.array(z.string()).optional(),
  referredBy: z.string().optional(),

});

type Inputs = z.infer<typeof schema>;

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
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [selectedTests, setSelectedTests] = useState(() =>
    type === "update" && data?.memoTest
      ? testOptions.filter((test) => data.memoTest?.includes(test.name))
      : []
  );

  // Add a test
  const handleAddTest = (testId: number) => {
    const selectedTest = testOptions.find((test) => test.id === testId);
    if (selectedTest && !selectedTests.some((test) => test.id === testId)) {
      setSelectedTests((prev) => [...prev, selectedTest]);
    }
  };

  // Remove a test
  const handleRemoveTest = (testId: number) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== testId));
  };

  const totalCost = selectedTests.reduce((sum, test) => sum + test.cost, 0);
  const paidAmount = Number(watch("paidAmount") || 0);
  const dueAmount = Math.max(0, totalCost - paidAmount);
  const returnableAmount = Math.max(0, paidAmount - totalCost);
  const paymentStatus = dueAmount > 0 ? "Due" : "Paid";

  const onSubmit = (formData: Inputs) => {
    console.log("Form Submitted:", formData);
    console.log("Selected Tests:", selectedTests);
    console.log("Total Cost:", totalCost);
    console.log("Paid Amount:", paidAmount);
    console.log("Due Amount:", dueAmount);
    console.log("Payment Status:", paymentStatus);
    alert(`Memo Submitted! Total Cost: $${totalCost}, Payment Status: ${paymentStatus}`);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Memo" : "Update Memo"}
      </h1>

      {/* Patient Information Section */}
      <span className="text-xl text-gray-400 font-medium">Patient Information</span>
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <InputFields
          label="Patient Name"
          name="patientName"
          register={register("patientName")}
          error={errors.patientName}
        />
        <InputFields label="Age" name="age" register={register("age")} error={errors.age} />
        <InputFields
          label="Phone"
          name="phone"
          register={register("phone")}
          error={errors.phone}
        />
        <div className="w-full md:w-1/4">
          <label htmlFor="gender" className="text-xs text-gray-500 block m-1">
            Gender
          </label>
          <select
            id="gender"
            className={`p-2 border rounded-md ${errors.gender ? "border-red-400" : "border-gray-300"
              }`}
            {...register("gender")}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender.message}</p>}
        </div>
        <InputFields
          label="Email"
          name="email"
          register={register("email")}
          error={errors.email}
        />
        <InputFields
          label="Address"
          name="address"
          register={register("address")}
          error={errors.address}
        />
      </div>

      {/* Test Information Section */}
      <span className="text-xl text-gray-400 font-medium">Test Information</span>
      <div className="flex justify-between gap-2">
        {type === "create" && (
          <div className="w-1/3">
            <label className="text-xs text-gray-500 block">Select Test</label>
            <select
              className="p-2 border rounded-md"
              onChange={(e) => handleAddTest(Number(e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>
                Select Test
              </option>
              {testOptions.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name} - ${test.cost}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="w-2/3 bg-gray-100 rounded-md">
          <label className="text-xs text-gray-500">Selected Tests</label>
          <div className="px-1">
            {selectedTests.length ? (
              selectedTests.map((test) => (
                <div className="flex justify-between items-center" key={test.id}>
                  <span>{test.name} - ${test.cost}</span>
                  {type === "create" && (
                    <button type="button" onClick={() => handleRemoveTest(test.id)}>
                      <MdCancelPresentation />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No tests selected</p>
            )}
            <p>
              Total Cost: <span className="font-semibold">${totalCost}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Information Section */}
      <span className="text-xl text-gray-400 font-medium">Payment Information</span>
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <InputFields
          label="Paid Amount"
          name="paidAmount"
          type="number"
          register={register("paidAmount")}
          error={errors.paidAmount}
        />
        {/* Referral Doctor Select */}
        <div className="w-full md:w-1/3">
          <label htmlFor="referredBy" className="text-xs text-gray-500 block m-1">
            Referred By
          </label>
          <select
            id="referredBy"
            className="p-2 border rounded-md w-full"
            {...register("referredBy")}
          >
            <option value="" disabled>
              Select Doctor
            </option>
            <option value="Ali Hasan">Ali Hasan</option>
            <option value="Sarah Khan">Sarah Khan</option>
            <option value="John Doe">John Doe</option>
          </select>
          {errors.referredBy && (
            <p className="text-xs text-red-400 mt-1">{errors.referredBy.message}</p>
          )}
        </div>
        <div className="flex space-x-4">
          <div className="w-1/3">
            <label className="text-xs text-gray-500 block m-1">Due</label>
            <input
              type="text"
              value={dueAmount}
              readOnly
              className="p-2 border rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="text-xs text-gray-500 block m-1">Returnable</label>
            <input
              type="text"
              value={returnableAmount} // updated to show returnableAmount
              readOnly
              className="p-2 border rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="text-xs text-gray-500 block m-1">Payment Status</label>
            <input
              type="text"
              value={paymentStatus}
              readOnly
              className="p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded-md mt-4"
      >
        {type === "create" ? "Create Memo" : "Update Memo"}
      </button>
    </form>
  );
};

export default MemoForm;
