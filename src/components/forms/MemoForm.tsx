"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dispatch, SetStateAction, useState, ChangeEvent, useEffect } from "react";
import InputFields from "../InputFields";
import { MdCancelPresentation } from "react-icons/md";
import { memoSchema, MemoSchema } from "@/lib/FormValidationSchemas";
import { createMemo, updateMemo, updateTest } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Test {
  id: string;
  name: string;
  price: number;
  roomNo: string
}

interface Referral {
  id: string;
  name: string;
}
interface ReferredBy {
  id: string;
  name: string;
}

interface MemoFormProps {
  type: "create" | "update";
  data?: Partial<MemoSchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    tests?: Test[];
    selectedTest?: Test[];
    referral?: ReferredBy[];
  };
}

const MemoForm = ({ type, data, setOpen, relatedData }: MemoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MemoSchema>({
    resolver: zodResolver(memoSchema),
    defaultValues: {
      ...data,
      paidAmount: data?.paidAmount || 0,
      discount: data?.discount || 0,
      referredBy: data?.referredBy || "",
    },
  });

  const router = useRouter();
  const referralMemo = Array.isArray(relatedData?.referral) ? relatedData.referral : [];
  const patientTests = Array.isArray(relatedData?.tests) ? relatedData.tests : [];
  const selectedTestsInitial = type === "update" && data?.memoTest
    ? patientTests.filter((test) => data.memoTest?.includes(test))
    : [];

  const [selectedTests, setSelectedTests] = useState<Test[]>(selectedTestsInitial);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  useEffect(() => {
    // Set selectedReferral based on referredBy field in data
    if (data?.referredBy) {
      const referral = referralMemo.find((ref) => ref.name === data.referredBy);
      setSelectedReferral(referral || null);
      setValue("referredBy", referral?.name || ""); // Ensure form value is set correctly
    } else if (type === "create") {
      setSelectedReferral(null); // Clear referral for new memos
      setValue("referredBy", "");
    }
  }, [data?.referredBy, referralMemo, type, setValue]);
  
  const handleAddTest = (testId: string) => {
    const selectedTest = patientTests.find((test) => test.id === testId);
    if (selectedTest && !selectedTests.some((test) => test.id === testId)) {
      setSelectedTests((prev) => [...prev, selectedTest]);
    }
  };

  const handleRemoveTest = (testId: string) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== testId));
  };

  const totalCost = data?.totalAmount || selectedTests.reduce((sum, test) => sum + test.price, 0);

  const paidAmount = Number(watch("paidAmount") || 0);
  const discountPercentage = Number(watch("discount") || 0);

  const discountAmount = (totalCost * discountPercentage) / 100;
  const finalAmount = totalCost - discountAmount;
  const dueAmount = Math.max(0, finalAmount - paidAmount);
  const returnableAmount = Math.max(0, paidAmount - finalAmount);
  const paymentMethod = dueAmount > 0 ? "Due" : "Paid";

  const onSubmit: SubmitHandler<MemoSchema> = async (formData) => {
    console.log("Submitted Form Data:", formData);

    const prismaFormattedTests = selectedTests.map((test) => ({
      id: test.id,
      name: test.name,
      price: test.price,
      roomNo: test.roomNo,
    }));

    const prismaInput = {
      ...formData,
      memoTest: prismaFormattedTests,
      totalAmount: totalCost,
      dueAmount: dueAmount,
      paymentMethod: data?.paymentMethod || (dueAmount > 0 ? "DUE" : "PAID") as "PAID" | "DUE",
    };

    if (type === "update") {
      delete prismaInput.referredBy;
    }

    console.log("Updated Prisma Data:", prismaInput);

    try {
      if (type === "create") {
        await createMemo(prismaInput);
        toast.success("Memo successfully created.");
      } else if (type === "update" && formData.id) {
        await updateMemo(prismaInput);
        toast.success("Memo successfully updated.");
      } else {
        throw new Error("ID is missing for update.");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const availableTests = Array.isArray(relatedData?.tests) ? relatedData.tests : [];

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Memo" : "Update Memo"}</h1>

      <span className="text-xl text-gray-400 font-medium">Patient Information</span>
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="grid grid-cols-3 gap-4 justify-around items-center w-full">
          {data && (
            <InputFields
              label="ID"
              name="id"
              register={register("id")}
              error={errors.id}
              hidden
            />
          )}
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

          <div>
            <label htmlFor="gender" className="text-xs text-gray-500 block m-1">Gender</label>
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
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="dateOfBirth" className="text-xs text-gray-500">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              {...register("dateOfBirth")}
              className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${errors.dateOfBirth ? "ring-red-500" : "ring-gray-300"}`}
            />
            {errors.dateOfBirth && <p className="text-xs text-red-400 mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          <InputFields
            label="Address"
            name="address"
            register={register("address")}
            error={errors.address} />


          <div>
            <label className="text-xs text-gray-500 block mb-1">Reference</label>
            <select
              className={`p-2 border rounded-md ${errors.referredBy ? "border-red-400" : "border-gray-300"}`}
              {...register("referredBy")}
              value={selectedReferral?.id || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const referral = referralMemo.find((ref) => ref.id === e.target.value);
                setSelectedReferral(referral || null);
                setValue("referredBy", referral?.name || "")
              }}
            >
              <option disabled value="">
                Select Reference
              </option>
              {referralMemo.length ? (
                referralMemo.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.name}
                  </option>
                ))
              ) : (
                <option disabled>No references available</option>
              )}
            </select>
            {errors.referredBy && (
              <p className="text-xs text-red-400 mt-1">{errors.referredBy.message}</p>
            )}
          </div>

        </div>
      </div>

      {
        type === "create" && (
          <div className="">
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
                      <option key={test.id} value={test.id}>{test.name} - ${test.price}</option>
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
                </div>
              </div>
            </div>
          </div>
        )
      }

      <span className="text-xl text-gray-400 font-medium">Payment Information</span>
      <div className="grid grid-cols-4 gap-2 w-full justify-center items-center">
        {type === "update" && (
          <InputFields
            label="Total Amount"
            name="totalAmount"
            type="number"
            register={register("totalAmount", { valueAsNumber: true })}
            error={errors.totalAmount}
            disabled
          />
        )}
        <InputFields
          label="Paid Amount"
          name="paidAmount"
          type="number"
          register={register("paidAmount", { valueAsNumber: true })}
          error={errors.paidAmount}
        />
        <InputFields
          label="Discount"
          name="discount"
          type="number"
          register={register("discount", { valueAsNumber: true })}
          error={errors.discount}
        />
        <div>
          <label className="text-xs text-gray-500 block m-1">Due</label>
          <input type="text" value={dueAmount} readOnly className="p-2 border rounded-md" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block m-1">Returnable</label>
          <input type="text" value={returnableAmount} readOnly className="p-2 border rounded-md" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block m-1">Payment Status</label>
          <input type="text" value={paymentMethod} readOnly className="p-2 border rounded-md" />
        </div>
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default MemoForm;
