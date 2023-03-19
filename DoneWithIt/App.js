import { StatusBar } from "expo-status-bar";
import { Dimensions, Text, View } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";

export default function App() {
  const [profitYear, setProfitYear] = useState([]);
  const [profitValue, setProfitValue] = useState([]);

  useEffect(() => {
    let isMounted = true; // set a flag to check if the component is mounted

    fetchData();

    return () => {
      isMounted = false; // set the flag to false when the component unmounts
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/goal");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      var profitdate = jsonData.map((item) => item.year);
      var profitvaluestring = jsonData.map((item) => item.profit);
      const profitvalue = parseFloat(profitvaluestring);
      setProfitYear(profitdate);
      setProfitValue(profitvalue);
    } catch (error) {
      console.error(error);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second and retry the function
      await fetchData();
    }
  };
  const line = {
    labels: profitYear,
    datasets: [
      {
        data: profitValue,
        strokeWidth: 2, // optional
      },
    ],
  };
  const barData = {
    labels: profitYear,
    datasets: [
      {
        data: profitValue,
      },
    ],
  };
  return (
    <View>
      <Text>Line Chart</Text>
      <LineChart
        data={line}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel={"$"}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text>Bar Chart</Text>
      <BarChart
        // style={graphStyle}
        data={barData}
        width={screenWidth}
        height={220}
        yAxisLabel={"$"}
        chartConfig={chartConfig}
      />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
