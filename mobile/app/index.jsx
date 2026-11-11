import { Link } from "expo-router";
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.heading}>Home</Text>
      <Link href={"/about"}>About</Link>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "purple",
  },
  heading: {
    color: "white",
    fontSize: 26,
  }
})