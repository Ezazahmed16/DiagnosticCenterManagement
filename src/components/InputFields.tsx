import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: ReturnType<UseFormRegister<any>>; 
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean; 
  hidden?: boolean
};

const InputFields = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  disabled, 
  hidden
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>
      <input
        id={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled} // Pass `disabled` to the input element
        {...register} // Spread the `register` function call
        {...inputProps} // Spread additional input props
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
