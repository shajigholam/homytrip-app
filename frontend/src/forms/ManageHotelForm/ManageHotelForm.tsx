import {FormProvider, useForm} from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import {HotelType} from "../../../../backend/src/shared/types";
import {useEffect} from "react";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

type Props = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
  hotel: HotelType;
};

const ManageHotelForm = ({onSave, isLoading, hotel}: Props) => {
  const formMethods = useForm<HotelFormData>();
  const {handleSubmit, reset} = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]); // reset is included to satisfy lint rules and avoid edge-case bugs.

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    console.log(formDataJson);
    //create a new formdata obj and call our API
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // in the backend Multer will collect all files with the same field name (imageFiles) into an array.( upload.array("imageFiles") )
    Array.from(formDataJson.imageFiles).forEach(imageFile => {
      formData.append("imageFiles", imageFile);
    });

    onSave(formData);
  });
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-indigo-600 text-white p-2 font-bold hover:bg-indigo-500 text-xl disabled:text-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;

/**
 * this form is bigger and i will split it into multiple components
 * so instead of destructing useForm here and send the functions as props to every child component, we will use:
 * FormProvider to make the form methods availlable through useFormContext
 */
