import {
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import React from "react";
import Linear from "./Linear";
import { Color } from "../constants/styles";

export function PrimaryButton({ label, onPress, other }) {
  return (
    <Linear
      style={other ? [other, { borderRadius: 10 }] : { borderRadius: 10 }}
    >
      <TouchableHighlight
        underlayColor="rgba(0, 0, 0, 0.2)"
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.white}>{label}</Text>
      </TouchableHighlight>
    </Linear>
  );
}

export function SecondaryButton({ label, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.white}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  white: {
    color: Color,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
  button: { paddingVertical: 15, borderRadius: 10 },
});
