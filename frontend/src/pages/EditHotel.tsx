import {useMutation, useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import {useAppContext} from "../contexts/AppContext";

const EditHotel = () => {
  const {hotelId} = useParams();

  const {showToast} = useAppContext();

  const {data: hotel} = useQuery({
    queryKey: ["fetchMyHotelById"],
    queryFn: () => apiClient.fetchMyHotelById(hotelId || ""),
    //The query only runs when hotelId is valid.
    enabled: !!hotelId,
  });

  const mutation = useMutation({
    mutationFn: apiClient.updateMyHotelById,
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

  return (
    <ManageHotelForm
      hotel={hotel}
      onSave={handleSave}
      isLoading={mutation.isPending}
    />
  );
};

export default EditHotel;
