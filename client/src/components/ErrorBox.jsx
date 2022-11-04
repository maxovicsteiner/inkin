import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ErrorColor } from "../constants/styles";

export function ErrorBox({ style, error }) {
  return (
    <LinearGradient
      colors={ErrorColor}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={style}
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>{error}</Text>
    </LinearGradient>
  );
}
