import { createContext, use, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Main App Functionality Start
  const [sheets, setSheets] = useState([]);

  const [loading, setLoading] = useState(true);
  // Replace with your actual API endpoint
  // const apiUrl = "http://192.168.1.11:5000/api/sheets";

  // const apiUrl = "http://192.168.79.151:5000/api/sheets";
  const apiUrl = "https://meal-manage-back.vercel.app/api/sheets"; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchSheets = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/list`);
        const result = await response.json();

        setSheets((prevSheets) => {
          return ["Select Sheet", ...result.slice(0, result.length - 1)];
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sheets:", error);
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  // Date functionality
  const monthsNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();
  const year = today.getFullYear();
  const lastTwoDigits = String(year).substring(2);
  const currentMonth = today.getMonth(); // Months are 0-indexed

  const currentData = monthsNames[currentMonth];
  const currentSheet = `${currentData} ${lastTwoDigits}`;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(currentSheet);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (!selectedSheet || selectedSheet === "Select Sheet") {
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}?sheetName=${selectedSheet}`);

        if (!response.ok) {
          const errorText = await response.text(); // Get error message
          console.error("API error response:", errorText); // Debug: Print error
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error); // Debug: Print the error
        setError(error);
      } finally {
        setLoading(false);
        setRefreshing(false); // Reset refreshing state
        console.log("Fetch completed"); // Debug: Print completion
      }
    };

    fetchData();
  }, [selectedSheet, refreshing]);

  // Main App Functionality End

  // Monthly Summary Functionality Start
  const [selectedValue, setSelectedValue] = useState("Bazar");
  const [values] = useState([
    "Bazar",
    "Meal",
    "Extra Spend",
    "Debit",
    "Total With Extra",
  ]);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    setLoading(true);
    switch (selectedValue) {
      case "Bazar":
        setSelectedData({
          Name: "Amount",
          [personNames[1]]: data?.[[personNames[1].toLowerCase()]]?.totalBazar,
          [[personNames[3]]]:
            data?.[[personNames[3].toLowerCase()]]?.totalBazar,
          [[personNames[2]]]:
            data?.[[personNames[2].toLowerCase()]]?.totalBazar,
          [[personNames[6]]]:
            data?.[[personNames[6].toLowerCase()]]?.totalBazar,
          [[personNames[5]]]:
            data?.[[personNames[5].toLowerCase()]]?.totalBazar,
          [[personNames[4]]]:
            data?.[[personNames[4].toLowerCase()]]?.totalBazar,
        });
        setLoading(false);
        break;
      case "Meal":
        setSelectedData({
          Name: "Amount",
          [personNames[1]]: data?.[[personNames[1].toLowerCase()]]?.totalMeal,
          [[personNames[3]]]: data?.[[personNames[3].toLowerCase()]]?.totalMeal,
          [[personNames[2]]]: data?.[[personNames[2].toLowerCase()]]?.totalMeal,
          [[personNames[6]]]: data?.[[personNames[6].toLowerCase()]]?.totalMeal,
          [[personNames[5]]]: data?.[[personNames[5].toLowerCase()]]?.totalMeal,
          [[personNames[4]]]: data?.[[personNames[4].toLowerCase()]]?.totalMeal,
        });
        setLoading(false);
        break;
      case "Extra Spend":
        setSelectedData({
          Name: "Amount",
          [personNames[1]]: data?.[[personNames[1].toLowerCase()]]?.extraSpend,
          [[personNames[3]]]:
            data?.[[personNames[3].toLowerCase()]]?.extraSpend,
          [[personNames[2]]]:
            data?.[[personNames[2].toLowerCase()]]?.extraSpend,
          [[personNames[6]]]:
            data?.[[personNames[6].toLowerCase()]]?.extraSpend,
          [[personNames[5]]]:
            data?.[[personNames[5].toLowerCase()]]?.extraSpend,
          [[personNames[4]]]:
            data?.[[personNames[4].toLowerCase()]]?.extraSpend,
        });
        setLoading(false);
        break;
      case "Debit":
        setSelectedData({
          Name: "Amount",
          [personNames[1]]: data?.[[personNames[1].toLowerCase()]]?.debitCredit,
          [[personNames[3]]]:
            data?.[[personNames[3].toLowerCase()]]?.debitCredit,
          [[personNames[2]]]:
            data?.[[personNames[2].toLowerCase()]]?.debitCredit,
          [[personNames[6]]]:
            data?.[[personNames[6].toLowerCase()]]?.debitCredit,
          [[personNames[5]]]:
            data?.[[personNames[5].toLowerCase()]]?.debitCredit,
          [[personNames[4]]]:
            data?.[[personNames[4].toLowerCase()]]?.debitCredit,
        });
        setLoading(false);
        break;
      case "Total With Extra":
        setSelectedData({
          Name: "Amount",
          [personNames[1]]: data?.[[personNames[1].toLowerCase()]]?.totalExtra,
          [[personNames[3]]]:
            data?.[[personNames[3].toLowerCase()]]?.totalExtra,
          [[personNames[2]]]:
            data?.[[personNames[2].toLowerCase()]]?.totalExtra,
          [[personNames[6]]]:
            data?.[[personNames[6].toLowerCase()]]?.totalExtra,
          [[personNames[5]]]:
            data?.[[personNames[5].toLowerCase()]]?.totalExtra,
          [[personNames[4]]]:
            data?.[[personNames[4].toLowerCase()]]?.totalExtra,
        });
        setLoading(false);
        break;
      default:
        setSelectedData(null);
        setLoading(false);
    }
  }, [selectedValue, data, personNames]);

  // Monthly Summary Functionality End

  // Person Data Functionality Start

  const [selectedPerson, setSelectedPerson] = useState("Select Person");
  const [personData, setPersonData] = useState(null);
  const [personNames, setPersonNames] = useState([]);

  useEffect(() => {
    const fetchPersonNames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/names?sheetName=${selectedSheet}`
        );
        const result = await response.json();
        setPersonNames((prevSheets) => {
          return ["Select Person", ...result];
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching person names:", error);
        setLoading(false);
      }
    };
    fetchPersonNames();
  }, [selectedSheet, data]);

  useEffect(() => {
    if (selectedPerson === "Select Person") {
      setPersonData(null);
    }
    if (data && selectedPerson !== "Select Person") {
      const personData = data[selectedPerson.toLowerCase()];
      setPersonData(personData);
    }
  }, [selectedPerson, data]);

  // Person Data Functionality End

  // Extra Cost Functionality Start
  const [extraSpends, setExtraSpends] = useState({
    [personNames[1]]:
      data?.[[personNames[1].toLowerCase()]]?.extraSpend?.toString() || "",
    [[personNames[3]]]:
      data?.[[personNames[3].toLowerCase()]]?.extraSpend?.toString() || "",
    [[personNames[2]]]:
      data?.[[personNames[2].toLowerCase()]]?.extraSpend?.toString() || "",
    [[personNames[6]]]:
      data?.[[personNames[6].toLowerCase()]]?.extraSpend?.toString() || "",
    [[personNames[5]]]:
      data?.[[personNames[5].toLowerCase()]]?.extraSpend?.toString() || "",
    [[personNames[4]]]:
      data?.[[personNames[4].toLowerCase()]]?.extraSpend?.toString() || "",
  });

  useEffect(() => {
    if (data) {
      setExtraSpends({
        [personNames[1]]:
          data?.[[personNames[1].toLowerCase()]]?.extraSpend?.toString() || "",
        [[personNames[3]]]:
          data?.[[personNames[3].toLowerCase()]]?.extraSpend?.toString() || "",
        [[personNames[2]]]:
          data?.[[personNames[2].toLowerCase()]]?.extraSpend?.toString() || "",
        [[personNames[6]]]:
          data?.[[personNames[6].toLowerCase()]]?.extraSpend?.toString() || "",
        [[personNames[5]]]:
          data?.[[personNames[5].toLowerCase()]]?.extraSpend?.toString() || "",
        [[personNames[4]]]:
          data?.[[personNames[4].toLowerCase()]]?.extraSpend?.toString() || "",
      });
    }
  }, [data]);

  // Extra Cost Functionality End

  // Meal Table Functionality Start

  const [mealTableData, setMealTableData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `${apiUrl}/mealtable?sheetName=${selectedSheet}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }
          const result = await response.json();
          setMealTableData(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      if (selectedSheet) {
        //prevent the api call with empty selectedSheet
        fetchData();
      }
    }, [selectedSheet]);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        setLoading,
        error,
        sheets,
        selectedSheet,
        setSelectedSheet,
        handleRefresh,
        refreshing,
        selectedValue,
        setSelectedValue,
        values,
        selectedData,
        personData,
        personNames,
        selectedPerson,
        setSelectedPerson,
        apiUrl,
        extraSpends,
        setExtraSpends,
        mealTableData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
