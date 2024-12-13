import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: ReturnType<UseFormRegister<any>>; // Correct type for the register function
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
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>
      <input
        id={name}
        type={type}
        defaultValue={defaultValue}
        {...register} // Spread the `register` function call
        {...inputProps} // Additional input props
        className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${
          error ? "ring-red-500" : "ring-gray-500"
        }`}
      />
      {error?.message && (
        <p className="text-red-500 text-sm font-bold">{error.message}</p>
      )}
    </div>
  );
};

export default InputFields;
