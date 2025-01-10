import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { testSchema, TestSchema } from "@/lib/FormValidationSchemas";
import InputFields from "../InputFields";
import { createTest, updateTest } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddTestForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: Partial<TestSchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TestSchema>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      ...data,
    },
  });

  const router = useRouter();

  const testCost = watch("testCost", 0);
  const additionalCost = watch("additionalCost", 0);

  // Update price dynamically
  useEffect(() => {
    const calculatedPrice = testCost + additionalCost;
    setValue("price", calculatedPrice);
  }, [testCost, additionalCost, setValue]);

  // Ensure performers is always an array
  // const performers = Array.isArray(relatedData?.performers) ? relatedData.performers : [];

  const onSubmit = async (formData: TestSchema) => {
    console.log(formData);
    try {
      if (type === "create") {
        await createTest(formData);
        toast.success("Test record successfully created.");
      } else if (type === "update" && formData.id) {
        await updateTest(formData);
        toast.success("Test record successfully updated.");
      } else {
        throw new Error("Test ID is missing for update.");
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
        {type === "create" ? "Create a new Test" : "Update Test"}
      </h1>

      <div className="grid grid-cols-3 justify-between flex-wrap gap-4">
        <InputFields
          label="Test Name"
          name="name"
          register={register("name")}
          error={errors.name}
        />
        <InputFields
          label="Description"
          name="description"
          register={register("description")}
          error={errors.description}
        />
        <InputFields
          label="Test Cost"
          name="testCost"
          register={register("testCost", { valueAsNumber: true })}
          error={errors.testCost}
          type="number"
        />
        <InputFields
          label="Additional Cost"
          name="additionalCost"
          register={register("additionalCost", { valueAsNumber: true })}
          error={errors.additionalCost}
          type="number"
        />
        <InputFields
          label="Price (Auto-calculated)"
          name="price"
          register={register("price", { valueAsNumber: true })}
          error={errors.price}
          type="number"
          disabled
        />
        <InputFields
          label="Room Number"
          name="roomNo"
          register={register("roomNo")}
          error={errors.roomNo}
        />
        <InputFields
          label="Report Deliverable"
          name="deliveryTime"
          register={register("deliveryTime")}
          error={errors.deliveryTime}
        />
        {data && (
          <InputFields
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register("id")}
            error={errors?.id}
            hidden
          />
        )}

      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AddTestForm;
