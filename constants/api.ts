import axios from "axios";
import { token } from "./urls";

export const fetchHouseData = async () => {
  try {
    const response = await axios.get(
      "https://api.villavilla.com/partner-api/v1/houses/?house_id=122",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching house data:", error);
    throw error;
  }
};
export const fetchAvailbleDates = async () => {
  try {
    const response = await axios.get<any[]>(
      "https://api.villavilla.com/partner-api/v1/houses/122/availability?currency_code=208",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booking data:", error);
  }
};
