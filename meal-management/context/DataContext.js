import { createContext, use, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Replace with your actual API endpoint
  // const apiUrl = "http://192.168.1.12:5000/api/sheets";

  // const apiUrl = "http://192.168.79.151:5000/api/sheets";
  const apiUrl = "https://meal-manage-back.vercel.app/api/sheets"; // Replace with your actual API endpoint

  // Main App Functionality Start
  const [sheets, setSheets] = useState([]);

  const [loading, setLoading] = useState(true);
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
  const [selectedValue, setSelectedValue] = useState("Bazar");
  const [values] = useState([
    "Bazar",
    "Meal",
    "Extra Spend",
    "Debit",
    "Total With Extra",
  ]);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("Select Person");
  const [personData, setPersonData] = useState(null);
  const [personNames, setPersonNames] = useState([]);
  const [extraSpends, setExtraSpends] = useState({});
  const [mealTableData, setMealTableData] = useState([]);
  const [bazarTableData, setBazarTableData] = useState([]);
  const [bazarListData, setBazarListData] = useState([]);

  const checkMonth = () => {
    const currentMonth = today.getMonth(); // Months are 0-indexed
    const currentYear = today.getFullYear();
    const currentYearString = String(currentYear).substring(2);
    const currentData = monthsNames[currentMonth];
    const monthIndex = monthsNames.indexOf(currentData);
    const [selectedMonth, year] = selectedSheet.split(" ");
    const selectedMonthIndex = monthsNames.indexOf(selectedMonth);
    
    return selectedMonthIndex > monthIndex || year > currentYearString ? -1 : 1;
  };

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

  const handleRefresh = () => {
    setRefreshing(true);
  };

  // Fetch data when selectedSheet changes
  useEffect(() => {
    if (!selectedSheet || selectedSheet === "Select Sheet" || checkMonth() === -1) {
      setData(null);
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
      }
    };

    fetchData();
  }, [selectedSheet, refreshing]);

  // Getting person names

  useEffect(() => {
    const fetchPersonNames = async () => {
      if (!selectedSheet || selectedSheet === "Select Sheet" || checkMonth() === -1) {
        return;
      }
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
  }, [selectedSheet]);

  


  // Monthly Summary Functionality Start

  useEffect(() => {
    setLoading(true);
  
    const fieldMap = {
      "Bazar": "totalBazar",
      "Meal": "totalMeal",
      "Extra Spend": "extraSpend",
      "Debit": "debitCredit",
      "Total With Extra": "totalExtra",
    };
  
    const field = fieldMap[selectedValue];
  
    if (field) {
      const selected = { Name: "Amount" };
  
      personNames.slice(1).forEach(name => {
        selected[name] = data?.[name.toLowerCase()]?.[field];
      });
  
      setSelectedData(selected);
    } else {
      setSelectedData(null);
    }
  
    setLoading(false);
  }, [selectedValue, data]);
  

  // Monthly Summary Functionality End

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

  useEffect(() => {
    if (data) {
      const extraSpends = {};
      personNames.slice(1).forEach((name) => {
        extraSpends[name] = data[name.toLowerCase()].extraSpend === '' ? '৳0.00' : data[name.toLowerCase()].extraSpend;
      });
      setExtraSpends(extraSpends);
    }
  }, [data]);

  // Extra Cost Functionality End

  // Meal Table Functionality Start

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
  }, [selectedSheet, refreshing]);

  // Meal Table Functionality End

  // Bazar Table Functionality Start

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/bazartable?sheetName=${selectedSheet}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const result = await response.json();
        // console.log(result)
        setBazarTableData(result);
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
  }, [selectedSheet, refreshing]);

  // Bazar Table Functionality End

  // Bazar List Schedule Functionality Start

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/bazarlist?sheetName=${selectedSheet}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const result = await response.json();
        // console.log(result)
        setBazarListData(result);
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
        mealTableData,
        bazarTableData,
        bazarListData,
        setRefreshing,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
