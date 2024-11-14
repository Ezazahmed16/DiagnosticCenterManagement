import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegisterReturn; // Correct type for register
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputFields = ({
  label,
  type = "text",
  register,
  name,
  defaultValue = "",
  error,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        {...register} 
        className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${
          error ? "ring-red-500" : "ring-gray-500"
        }`}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-red-500 text-sm font-bold">{error.message}</p>
      )}
    </div>
  );
};

export default InputFields;
