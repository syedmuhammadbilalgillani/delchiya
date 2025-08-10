"use client";
import { useEffect } from "react";
import axios from "axios";

const LocalStorageSender = () => {
  useEffect(() => {
    // Step 1: Get the value from localStorage
    const localStorageValue = localStorage.getItem("preferredLanguage");

    if (localStorageValue) {
      // Step 2: Send the value to the server via an API route
      axios
        .post("/api/save-localstorage", { localStorageValue })
        .then((response) => {
          console.log("Server response:", response.data);
        })
        .catch((error) => {
          console.error("Error sending data to server:", error);
        });
    }
  }, []); // Empty dependency array to ensure this runs once when component mounts

  return <></>;
};

export default LocalStorageSender;
