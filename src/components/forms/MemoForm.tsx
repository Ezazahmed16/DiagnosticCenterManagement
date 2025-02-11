"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dispatch, SetStateAction, useState, ChangeEvent, useEffect, ReactNode } from "react";
import InputFields from "../InputFields";
import { MdCancelPresentation } from "react-icons/md";
import { memoSchema, MemoSchema } from "@/lib/FormValidationSchemas";
import { createMemo, updateMemo } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import AvailableTests from "../AvailableTestsSearch";

interface Test {
  deliveryTime: null;
  name: string;
  id: string;
  testName: string;
  price: number;
  roomNo: string;
  performer?: string;
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
    performers?: { id: string; name: string }[];
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
      referredBy: data?.referredBy || null,
      memoTest: data?.memoTest || [],
      extraDiscount: data?.extraDiscount || 0,
    },
  });
  const router = useRouter();
  const referralMemo = Array.isArray(relatedData?.referral) ? relatedData.referral : [];

  const patientTests = Array.isArray(relatedData?.tests) ? relatedData.tests : [];
  const selectedTestsInitial =
    type === "update" && data?.memoTest
      ? patientTests.filter((test) =>
        data?.memoTest?.some((memoTest) => memoTest.id === test.id)
      )
      : [];

  const [selectedTests, setSelectedTests] = useState<Test[]>(selectedTestsInitial);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");


  const availableTests = Array.isArray(relatedData?.tests) ? relatedData.tests : [];

  const filteredTests = availableTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (data?.referredById) {
      const referral = referralMemo.find((ref) => ref.id === data.referredById);
      setSelectedReferral(referral || null);
      setValue("referredBy", referral?.id || null);
    } else if (type === "create") {
      setSelectedReferral(null);
      setValue("referredBy", null);
    }
  }, [data?.referredById, referralMemo, type, setValue]);

  const handleAddTest = (testId: string) => {
    const selectedTest = patientTests.find((test) => test.id === testId);
    if (selectedTest && !selectedTests.some((test) => test.id === testId)) {
      setSelectedTests((prev) => [...prev, selectedTest]);
    }
  };

  const handleRemoveTest = (testId: string) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== testId));
  };

  const handlePerformerChange = (testId: string, performerId: string) => {
    setSelectedTests((prev) =>
      prev.map((test) =>
        test.id === testId
          ? {
            ...test,
            performer: performerId,
          }
          : test
      )
    );
  };


  const totalCost = data?.totalAmount || selectedTests.reduce((sum, test) => sum + test.price, 0);
  const paidAmount = Number(watch("paidAmount") || 0);
  const discountPercentage = Number(watch("discount") || 0);
  const extraDiscount = Number(watch("extraDiscount") || 0);
  const discountAmount = (totalCost * discountPercentage) / 100;
  const finalAmount = totalCost - (discountAmount + extraDiscount);
  const dueAmount = Math.max(0, finalAmount - paidAmount);
  const returnableAmount = Math.max(0, paidAmount - finalAmount);

  const paymentMethod: "PAID" | "DUE" | "PENDING" = dueAmount > 0 ? "DUE" : "PAID";


  const onSubmit: SubmitHandler<MemoSchema> = async (formData) => {
    const prismaFormattedTests = selectedTests.map((test) => ({
      id: test.id,
      testName: test.name,
      price: test.price,
      roomNo: test.roomNo,
      deliveryTime: test.deliveryTime || undefined,
      performedById: test.performer || "",
    }));

    const prismaInput = {
      ...formData,
      memoTest: prismaFormattedTests,
      totalAmount: totalCost,
      dueAmount: dueAmount,
      paymentMethod: paymentMethod,
      referredById: formData.referredBy || null,
      discountAmount: discountAmount,
    };


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

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Memo" : "Update Memo"}
      </h1>

      <span className="text-xl text-gray-400 font-medium">Patient Information</span>
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="grid grid-cols-4 gap-4 justify-around items-center w-full">
          {data && (
            <InputFields
              label="ID"
              name="id"
              register={register("id")}
              error={errors.id}
              hidden
            />
          )}
          {/* <InputFields
            label="Memo No"
            name="memoNo"
            register={register("memoNo")}
            error={errors.memoNo}
            hidden
          /> */}
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
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-400 mt-1">{errors.gender.message}</p>
            )}
          </div>
          <InputFields
            label="Age"
            name="dateOfBirth"
            register={register("dateOfBirth")}
            error={errors.dateOfBirth}
          />
          <InputFields
            label="Address"
            name="address"
            register={register("address")}
            error={errors.address}
          />
          <div className="">
            <label className="text-xs text-gray-500 block mb-1">Referral</label>
            <select
              className={`p-2 border rounded-md ${errors.referredBy ? "border-red-400" : "border-gray-300"
                }`}
              {...register("referredBy")}
              value={selectedReferral?.id || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const referral = referralMemo.find((ref) => ref.id === e.target.value);
                setSelectedReferral(referral || null);
                setValue("referredBy", referral?.id || "");
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

      {type === "create" && (
        <div>
          <span className="text-xl text-gray-400 font-medium">Test Information</span>

          <div className="w-full flex justify-center gap-14">

            {/* Available Tests List with Search Filter */}
            <div className="w-1/3">
              <label className="text-xs text-gray-500 block">Available Tests</label>
              <div className="border rounded-md">
                {/* Search Input */}
                <div className="relative p-2">
                  <input
                    type="text"
                    placeholder="Search tests..."
                    className="w-full p-2 border rounded-md focus:outline-none text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="h-48 overflow-y-auto border-t">
                  {filteredTests.length ? (
                    filteredTests.map((test: Test) => (
                      <div
                        key={test.id}
                        className="p-2 cursor-pointer hover:bg-gray-200 text-xs"
                        onDoubleClick={() => handleAddTest(test.id)}
                      >
                        {test.name} - ${test.price}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center p-2">No tests available</p>
                  )}
                </div>
              </div>
            </div>




            {/* Selected Tests List */}
            <div className="bg-gray-100 rounded-md w-2/3">
              <label className="text-xs text-gray-500">Selected Tests</label>
              <div className="border rounded-md h-48 overflow-y-auto">
                {selectedTests.length ? (
                  selectedTests.map((test: Test) => (
                    <div
                      key={test.id}
                      className="p-2 flex justify-between items-center hover:bg-gray-200"
                    >
                      <div className="text-xs flex-grow">
                        {test.name} - ${test.price}
                      </div>
                      <select
                        value={test.performer || ""}
                        onChange={(e) => handlePerformerChange(test.id, e.target.value)}
                        className="p-1 border rounded-md mx-1 text-xs"
                      >
                        <option value="" disabled>
                          Select Performer
                        </option>
                        {relatedData?.performers && relatedData.performers.length > 0 ? (
                          relatedData.performers.map((performer) => (
                            <option key={performer.id} value={performer.id}>
                              {performer.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No performers available</option>
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveTest(test.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdCancelPresentation size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center p-2">No tests selected</p>
                )}
              </div>
            </div>



          </div>
        </div>

      )}

      <span className="text-xl text-gray-400 font-medium">Payment Information</span>
      <div className="grid grid-cols-5 gap-2 w-full justify-center items-center">
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
          label="Discount(%)"
          name="discount"
          type="number"
          register={register("discount", { valueAsNumber: true })}
          error={errors.discount}
          hidden
        />
        <InputFields
          label="Discount"
          name="extraDiscount"
          type="number"
          register={register("extraDiscount", { valueAsNumber: true })}
          error={errors.extraDiscount}
        />
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 block m-1">Due</label>
          <input type="text" value={dueAmount} readOnly className="p-2 border rounded-md bg-slate-200" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 block m-1">Returnable</label>
          <input type="text" value={returnableAmount} readOnly className="p-2 border rounded-md  bg-slate-200" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 block m-1">Payment Status</label>
          <input type="text" value={paymentMethod} readOnly className="p-2 border rounded-md  bg-slate-200" />
        </div>
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default MemoForm;
