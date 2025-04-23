import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import * as apiClient from "../api-client";
import {useAppContext} from "../contexts/AppContext";
import {useNavigate} from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};
const SignIn = () => {
  const {showToast} = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    formState: {errors},
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation({
    mutationFn: apiClient.signIn,
    onSuccess: async () => {
      showToast({message: "Sign in Successful!", type: "SUCCESS"});
      await queryClient.invalidateQueries({queryKey: ["validateToken"]}); // tells React Query: this data is outdated!
      navigate("/");
      console.log("user logged in");
    },
    onError: async (error: Error) => {
      showToast({message: error.message, type: "ERROR"});
    },
  });

  const onSubmit = handleSubmit(data => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", {required: "This field is required"})}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 font-bold hover:bg-indigo-500 text-xl"
        >
          Sign in
        </button>
      </span>
    </form>
  );
};

export default SignIn;
