import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import * as apiClient from "../api-client";
import {AiFillStar} from "react-icons/ai";

const Detail = () => {
  const {hotelId} = useParams();
  const {data: hotel} = useQuery({
    queryKey: ["fetchHotelById"],
    queryFn: () => apiClient.fetchHotelById(hotelId as string),
    enabled: !!hotelId,
  });

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({length: hotel.starRating}).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
      </div>
    </div>
  );
};

export default Detail;
