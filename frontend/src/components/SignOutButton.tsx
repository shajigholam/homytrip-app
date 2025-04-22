import {useMutation, useQueryClient} from "@tanstack/react-query";
import * as apiClient from "../api-client";
import {useAppContext} from "../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const {showToast} = useAppContext();
  const mutation = useMutation({
    mutationFn: apiClient.signOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["validateToken"]});
      showToast({message: "Signed out successfully", type: "SUCCESS"});
    },
    onError: (error: Error) => {
      showToast({message: error.message, type: "ERROR"});
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <button
      onClick={handleClick}
      className="text-indigo-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
