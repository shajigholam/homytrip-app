import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import * as apiClient from "../api-client";
import {useAppContext} from "../contexts/AppContext";
import {useNavigate} from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {showToast} = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterFormData>();

  const onSubmit = handleSubmit(data => {
    //console.log(data);
    mutation.mutate(data);
  });

  // "mutation function" — it’s the actual function that performs API request. (This tells React Query that when someone calls mutate(), run this function to POST the data.)
  const mutation = useMutation({
    mutationFn: apiClient.register, // function that POSTs form data
    onSuccess: async () => {
      showToast({message: "Registration success", type: "SUCCESS"});
      await queryClient.invalidateQueries({queryKey: ["validateToken"]});
      navigate("/");
      //console.log("registration successful");
    },
    onError: (error: Error) => {
      showToast({message: error.message, type: "ERROR"});
      //console.log(error.message);
    },
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", {required: "This field is required"})}
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", {required: "This field is required"})}
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
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
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: val => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your passwords do not match";
              }
            },
          })}
        ></input>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 font-bold hover:bg-indigo-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;

/*
In React Query (@tanstack/react-query), useMutation is a hook for handling "write" operations, like:
Creating a user, Updating a profile, Deleting a post, Sending a form 
It’s different from useQuery, which is used to fetch data ("read" operations). 
*/
