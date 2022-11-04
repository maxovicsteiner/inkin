import { LinearGradient } from "expo-linear-gradient";

export default function Linear({ style, children }) {
  return (
    <LinearGradient
      colors={["#B20000", "#AD0087"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
