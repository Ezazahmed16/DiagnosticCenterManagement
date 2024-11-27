"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFields from "../InputFields";

// Enum for roles
enum Role {
    ADMIN = "Admin",
    USER = "User",
    MODERATOR = "Moderator",
}

// Schema definition
const schema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(50, { message: "Username must be at most 50 characters long!" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long!" })
        .max(50, { message: "Password must be at most 50 characters long!" }),
    email: z
        .string()
        .email({ message: "Please provide a valid email!" })
        .max(100, { message: "Email must be at most 100 characters long!" }),
    role: z.nativeEnum(Role, {
        message: "Role must be one of: Admin, User, or Moderator",
    }),
});

type Inputs = z.infer<typeof schema>;

const AddRoleForm = ({
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
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: data || {},
    });

    const onSubmit = (formData: Inputs) => {
        console.log("Form Submitted:", formData);
        alert(`User ${type === "create" ? "created" : "updated"} successfully!`);
        // Add actual API call logic here.
    };

    return (
        <form
            className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md max-w-lg mx-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-2xl font-semibold mb-4">
                {type === "create" ? "Add User" : "Update User"}
            </h1>

            {/* Username Input */}
            <InputFields
                label="Username"
                name="username"
                register={register("username")}
                error={errors.username}
            />

            {/* Password Input */}
            <InputFields
                label="Password"
                name="password"
                register={register("password")}
                error={errors.password}
                type="password"
            />

            {/* Email Input */}
            <InputFields
                label="Email"
                name="email"
                register={register("email")}
                error={errors.email}
                type="email"
            />

            {/* Role Input */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Role</label>
                <select
                    {...register("role")}
                    className="border px-4 py-2 rounded-md"
                >
                    {Object.values(Role).map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
                {errors.role && (
                    <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-700 transition"
            >
                {type === "create" ? "Add User" : "Update User"}
            </button>
        </form>
    );
};

export default AddRoleForm;
