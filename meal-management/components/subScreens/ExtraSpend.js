import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useDataContext } from "../../context/DataContext";

export const ExtraSpend = () => {
  const { data, loading, error, apiUrl } = useDataContext();

  const [extraSpends, setExtraSpends] = useState({
    shaikat: data?.shaikat?.extraSpend?.toString() || "",
    ajoy: data?.ajoy?.extraSpend?.toString() || "",
    pranto: data?.pranto?.extraSpend?.toString() || "",
    shanto: data?.shanto?.extraSpend?.toString() || "",
    somir: data?.somir?.extraSpend?.toString() || "",
    himel: data?.himel?.extraSpend?.toString() || "",
  });

  const handleChange = (name, value) => {
    setExtraSpends((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
    
    const handleUpdate = async (name) => {
        try {
            const response = await fetch(`${apiUrl}/sheets/extra`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    amount: extraSpends[name],
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Extra Spend of {data?.basicData?.month}
        </Text>
      </View>

      <ScrollView style={{ width: "100%" }}>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.boldCell]}>Name</Text>
                      <Text style={[styles.cell, styles.boldCell]}>Amount</Text>
                      <Text style={[styles.cell, styles.boldCell]}>Action</Text>
          </View>

          {["shaikat", "ajoy", "pranto", "shanto", "somir", "himel"].map(
            (name) => (
              <View key={name} style={styles.tableRow}>
                <Text style={styles.cell}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Text>
                <TextInput
                  style={[styles.cell, styles.input]}
                  keyboardType="numeric"
                  value={extraSpends[name]}
                  onChangeText={(text) => handleChange(name, text)}
                  placeholder="Enter amount"
                      />
                      <TouchableOpacity style={[styles.cell, styles.updateBtn]}
                      onPress={() => handleUpdate(name)}><Text style={styles.updateBtnText}>Update</Text></TouchableOpacity>
              </View>
            )
          )}
        </View>
          </ScrollView>

      {/* <View style={styles.titleContainer}>
        <Text style={styles.title}>Add Extra Spend</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#03A791",
    width: "100%",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  tableContainer: {
    borderRadius: 8,
    margin: 16,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FF0B55",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  boldCell: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 16,
    textAlign: "center",
    },
  updateBtn: {
    backgroundColor: "#03A791",
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
      justifyContent: "center",
    marginLeft: 10,
    },
  updateBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  
});
