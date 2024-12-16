"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";
import InputFields from "../InputFields";
import { MdCancelPresentation } from "react-icons/md";
import { memoSchema, MemoSchema } from "@/lib/FormValidationSchemas";

// Define the Test interface
interface Test {
  id: string;
  name: string;
  price: number;
}

// Define the MemoFormProps interface to type the component props
interface MemoFormProps {
  type: "create" | "update";
  data?: Partial<MemoSchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    tests?: Test[];
    selectedTest?: Test[];
  };
}

const MemoForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: MemoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MemoSchema>({
    resolver: zodResolver(memoSchema),
    defaultValues: data,
  });
  // Ensure relatedData is properly typed and falls back to an empty array if not available
  const patientTests = Array.isArray(relatedData?.tests) ? relatedData.tests : [];
  const selectedTestsInitial = type === "update" && data?.memoTest
    ? patientTests.filter((test) => data.memoTest?.includes(test.name))
    : [];

  const [selectedTests, setSelectedTests] = useState<Test[]>(selectedTestsInitial);

  // Handle adding a test
  const handleAddTest = (testId: string) => {
    const selectedTest = patientTests.find((test) => test.id === testId);
    if (selectedTest && !selectedTests.some((test) => test.id === testId)) {
      setSelectedTests((prev) => [...prev, selectedTest]);
    }
  };

  // Handle removing a test
  const handleRemoveTest = (testId: string) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== testId));
  };

  // Calculate the total cost, due amount, and returnable amount
  const totalCost = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const paidAmount = Number(watch("paidAmount") || 0);
  const dueAmount = Math.max(0, totalCost - paidAmount);
  const returnableAmount = Math.max(0, paidAmount - totalCost);
  const paymentStatus = dueAmount > 0 ? "Due" : "Paid";

  // Define the submit handler type for the form
  const onSubmit: SubmitHandler<MemoSchema> = async (formData) => {
    console.log(formData);
    // Your submit logic here, such as calling createMemo or updateMemo
  };

  // Ensure `selectedTests` is properly populated from `relatedData`
  const availableTests = Array.isArray(relatedData?.tests) ? relatedData.tests : [];

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
        <div className="w-full md:w-1/4">
          <label htmlFor="gender" className="text-xs text-gray-500 block m-1">
            Gender
          </label>
          <select
            id="gender"
            className={`p-2 border rounded-md ${errors.gender ? "border-red-400" : "border-gray-300"}`}
            {...register("gender")}
          >
            <option value="" disabled>Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender.message}</p>}
        </div>
        <InputFields
          label="Address"
          name="address"
          register={register("address")}
          error={errors.address}
        />
      </div>

      {/* Test Information Section */}
      <span className="text-xl text-gray-400 font-medium">Test Information</span>
      <div className="w-full grid grid-cols-2 gap-2 justify-between">
       <div className="w-full">
       <label className="text-xs text-gray-500 block mb-1">Select Test</label>
        <select
          multiple
          className="p-2 border rounded-md"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleAddTest(e.target.value)}
        >
          <option value="" disabled>Select Test</option>
          {availableTests.length ? (
            availableTests.map((test: Test) => (
              <option key={test.id} value={test.id}>
                {test.name} - {test.price}
              </option>
            ))
          ) : (
            <option disabled>No tests available</option>
          )}
        </select>
       </div>

        <div className="bg-gray-100 rounded-md w-full">
          <label className="text-xs text-gray-500">Selected Tests</label>
          <div className="px-1">
            {selectedTests.length ? (
              selectedTests.map((test: Test) => (
                <div className="flex justify-between items-center" key={test.id}>
                  <span>{test.name} - ${test.price}</span>
                  <button type="button" onClick={() => handleRemoveTest(test.id)}>
                    <MdCancelPresentation />
                  </button>
                </div>
              ))
            ) : (
              <p>No tests selected</p>
            )}
            <p>Total Cost: <span className="font-semibold">${totalCost}</span></p>
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
              value={returnableAmount}
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

      <button type="submit" className="bg-blue-500 text-white py-2 rounded-md mt-4">
        {type === "create" ? "Create Memo" : "Update Memo"}
      </button>
    </form>
  );
};

export default MemoForm;
