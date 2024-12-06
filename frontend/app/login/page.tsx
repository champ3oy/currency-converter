"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "../lib/features/authSlice";
import { useLoginMutation } from "../lib/api";
import Logo from "../components/Logo";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  console.log(errors);

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setToken(result.access_token));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 flex flex-col items-start">
        <Logo />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                {...register("email")}
                type="email"
                className="w-full bg-gray-200 h-[40px] rounded-2xl mt-1 px-5 text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
              <input
                {...register("password")}
                type="password"
                className="w-full bg-gray-200 h-[40px] rounded-2xl mt-1 px-5 text-sm"
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-10 py-2 rounded-full mt-3 "
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
