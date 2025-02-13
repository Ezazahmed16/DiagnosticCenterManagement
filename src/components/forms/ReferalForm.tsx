import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { referredBySchema, ReferredBySchema } from "@/lib/FormValidationSchemas";
import InputFields from "../InputFields";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createReferredBy, updateReferredBy, } from "@/lib/actions";

const ReferralForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: Partial<ReferredBySchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ReferredBySchema>({
    resolver: zodResolver(referredBySchema),
    defaultValues: {
      ...data,
      payments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const router = useRouter();
  
  const onSubmit = async (formData: ReferredBySchema) => {
    console.log(formData)
    try {
      // Convert all dates in the formData.payments to string format (YYYY-MM-DD)
      formData.payments = formData.payments?.map((payment) => ({
        ...payment,
        date: payment.date ? new Date(payment.date).toISOString().split("T")[0] : "",
        referredById: payment.referredById ?? data?.id ?? "",
      }));

      if (type === "create") {
        await createReferredBy(formData);
        toast.success("Referral successfully created.");
      } else if (formData.id) {
        if (formData.id) {
          console.log(formData)
          await updateReferredBy(formData);
        } else {
          console.error("Referral ID is missing for update.");
        }
        toast.success("Referral successfully updated.");
      } else {
        console.error("Referral ID is missing for update.");
      }
      setOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred! Please try again.");
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Referral" : "Update Referral"}
      </h1>

      <span className="text-md text-gray-400 font-medium">
        Referral Information
      </span>

      <div className="grid grid-cols-4 gap-4">
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
        {
          type === "update" &&
          <InputFields
            label="Total Amount"
            name="totalAmount"
            register={register("totalAmount", { valueAsNumber: true })}
            error={errors.totalAmount}
            disabled
          />
        }
        {data && (
          <InputFields
            label="Id"
            name="id"
            register={register("id")}
            error={errors.id}
            hidden
          />
        )}
      </div>

      {type === "update" && (
        <div className="mt-4">
          <h2 className="text-lg font-medium">Payments</h2>
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center">
                <InputFields
                  label="Payment Amount"
                  name={`payments.${index}.amount`}
                  register={register(`payments.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                  error={errors.payments?.[index]?.amount}
                />

                <InputFields
                  label="Payment Date"
                  name={`payments.${index}.date`}
                  type="date"
                  register={register(`payments.${index}.date`)}
                  error={errors.payments?.[index]?.date}
                />

                <button
                  type="button"
                  className="bg-red-500 text-white p-1 rounded"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded"
              onClick={() =>
                append({
                  referredById: data?.id || "",
                  amount: 0,
                  date: new Date().toISOString().split("T")[0], // Default to current date
                })
              }
            >
              Add Payment
            </button>
          </div>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="text-red-500">
          {Object.values(errors).map((err, idx) => (
            <div key={idx}>{err?.message}</div>
          ))}
        </div>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ReferralForm;
