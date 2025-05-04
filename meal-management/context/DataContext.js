import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
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
      const [sheets, setSheets] = useState([
        "Select Sheet",
        "April 24",
        "May 24",
        "June 24",
        "July 24",
        "Aug 24",
        "Sep 24",
        "Oct 24",
        "Nov 24",
        "Dec 24",
        "Jan 25",
        "Feb 25",
        "March 25",
        "April 25",
        "May 25",
        "June 25",
        "July 25",
        "Aug 25",
        "Sep 25",
        "Oct 25",
        "Nov 25",
        "Dec 25",
      ]);
      const [refreshing, setRefreshing] = useState(false);
    
      const handleRefresh = () => {
        setRefreshing(true);
      };
    
    // Replace with your actual API endpoint
      // http://192.168.1.11:5000/sheets
      // const apiUrl = "http://192.168.79.151:5000/sheets";
      const apiUrl = "https://meal-manage-back.vercel.app/sheets?sheetName="; // Replace with your actual API endpoint
    
      useEffect(() => {
        if (!selectedSheet || selectedSheet === "Select Sheet") {
          return;
        }
        const fetchData = async () => {
          setLoading(true);
          setError(null);
    
          try {
            console.log("Fetching data from API:", `${apiUrl}${selectedSheet}`); // Debug: Print the URL
            const response = await fetch(`${apiUrl}${selectedSheet}`);
            console.log("API response status:", response.data); // Debug: Print the response status
    
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
    
    return <DataContext.Provider value={{data, loading, error, sheets, selectedSheet, setSelectedSheet, handleRefresh, refreshing}}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);