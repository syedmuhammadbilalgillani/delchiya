import { fetchAvailbleDates } from "@/constants/api";
import FilterSection from "./filter-section";
export const dynamic = "force-dynamic";
const FilterHome = async () => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get<any[]>(
  //         "https://api.villavilla.com/partner-api/v1/houses/122/availability?currency_code=208",
  //         {
  //           headers: {
  //             Authorization: token,
  //           },
  //         }
  //       );
  //       const apiData = response.data;
  //       const periods = apiData.map((item) => ({
  //         from: normalizeDate(new Date(item.period.from)),
  //         to: normalizeDate(new Date(item.period.to)),
  //         originalData: item,
  //       }));

  //       setAvailablePeriods(periods);
  //       setFromDates(periods.map((period) => period.from));
  //       setToDates(periods.map((period) => period.to));
  //     } catch (error) {
  //       setError("Failed to load availability data. Please try again.");
  //       console.error("Error fetching booking data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  const res = await fetchAvailbleDates();
  return <FilterSection res={res} />;
};

export default FilterHome;
