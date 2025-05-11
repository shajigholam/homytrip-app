import {useMutation, useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";

const EditHotel = () => {
  const {hotelId} = useParams();

  const {data: hotel} = useQuery({
    queryKey: ["fetchMyHotelById"],
    queryFn: () => apiClient.fetchMyHotelById(hotelId || ""),
    //The query only runs when hotelId is valid.
    enabled: !!hotelId,
  });

  const mutation = useMutation({
    mutationFn: apiClient.updateMyHotelById,
    onSuccess: () => {},
    onError: () => {},
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
