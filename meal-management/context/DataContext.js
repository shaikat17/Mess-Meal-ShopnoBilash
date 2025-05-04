import { createContext, use, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Main App Functionality Start
  const [sheets, setSheets] = useState([]);
  // Replace with your actual API endpoint
  // http://192.168.1.11:5000/sheets
  // const apiUrl = "http://192.168.79.151:5000/sheets";
  const apiUrl = "https://meal-manage-back.vercel.app/sheets"; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await fetch(`${apiUrl}/list`);
        const result = await response.json();
  
        setSheets((prevSheets) => {
          return ["Select Sheet", ...result.slice(0, result.length - 1)];
        });
  
      } catch (error) {
        console.error("Error fetching sheets:", error);
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
  const [loading, setLoading] = useState(true);
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
    switch (selectedValue) {
      case "Bazar":
        setSelectedData({
          Name: "Amount",
          Shaikat: data?.shaikat?.totalBazar,
          Ajoy: data?.ajoy?.totalBazar,
          Shanto: data?.shanto?.totalBazar,
          Himel: data?.himel?.totalBazar,
          Pranto: data?.pranto?.totalBazar,
          Somir: data?.Somir?.totalBazar,
        });
        break;
      case "Meal":
        setSelectedData({
          Name: "Amount",
          Shaikat: data?.shaikat?.totalMeal,
          Ajoy: data?.ajoy?.totalMeal,
          Shanto: data?.shanto?.totalMeal,
          Himel: data?.himel?.totalMeal,
          Pranto: data?.pranto?.totalMeal,
          Somir: data?.Somir?.totalMeal,
        });
        break;
      case "Extra Spend":
        setSelectedData({
          Name: "Amount",
          Shaikat: data?.shaikat?.extraSpend,
          Ajoy: data?.ajoy?.extraSpend,
          Shanto: data?.shanto?.extraSpend,
          Himel: data?.himel?.extraSpend,
          Pranto: data?.pranto?.extraSpend,
          Somir: data?.Somir?.extraSpend,
        });
        break;
      case "Debit":
        setSelectedData({
          Name: "Amount",
          Shaikat: data?.shaikat?.debitCredit,
          Ajoy: data?.ajoy?.debitCredit,
          Shanto: data?.shanto?.debitCredit,
          Himel: data?.himel?.debitCredit,
          Pranto: data?.pranto?.debitCredit,
          Somir: data?.Somir?.debitCredit,
        });
        break;
      case "Total With Extra":
        setSelectedData({
          Name: "Amount",
          Shaikat: data?.shaikat?.totalExtra,
          Ajoy: data?.ajoy?.totalExtra,
          Shanto: data?.shanto?.totalExtra,
          Himel: data?.himel?.totalExtra,
          Pranto: data?.pranto?.totalExtra,
          Somir: data?.somir?.totalExtra,
        });
        break;
      default:
        setSelectedData(null);
    }
  }, [selectedValue, data]);

  // Monthly Summary Functionality End

  // Person Data Functionality Start

  const [selectedPerson, setSelectedPerson] = useState("Select Person");
  const [personData, setPersonData] = useState(null);
  const [personNames, setPersonNames] = useState([
  ]);
    
    useEffect(() => {
        const fetchPersonNames = async () => {
            try {
              const response = await fetch(`${apiUrl}/names?sheetName=${selectedSheet}`);
              const result = await response.json();
              setPersonNames((prevSheets) => {
                return ["Select Person", ...result];
              });
            } catch (error) {
              console.error("Error fetching person names:", error);
            }
        };
        fetchPersonNames();
    },[selectedSheet]);

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

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
