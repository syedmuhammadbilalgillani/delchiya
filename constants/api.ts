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
