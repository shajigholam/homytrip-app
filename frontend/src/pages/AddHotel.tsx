import {useMutation} from "@tanstack/react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import {useAppContext} from "../contexts/AppContext";
import * as apiClient from "../api-client";

const {showToast} = useAppContext();

const mutation = useMutation({
  mutationFn: apiClient.addMyHotel,
  onSuccess: () => {
    showToast({message: "Hotel Saved", type: "SUCCESS"});
  },
  onError: () => {
    showToast({message: "Error saving hotel", type: "ERROR"});
  },
});

const handleSave = (hotelFormData: FormData) => {
  mutation.mutate(hotelFormData);
};
const AddHotel = () => {
  return <ManageHotelForm onSave={handleSave} isLoading={mutation.isPending} />;
};

export default AddHotel;
