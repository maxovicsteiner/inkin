import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Logo from "../components/Logo";
import { BackgroundColor } from "../constants/styles";
import { PrimaryButton, SecondaryButton } from "../components/Button";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Logo fontSize={60} />
      <View style={styles.buttonsContainer}>
        <PrimaryButton
          label="Create New Account"
          onPress={() => navigation.navigate("Sign up")}
        />
        <SecondaryButton
          label="Log In"
          onPress={() => navigation.navigate("Sign in")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  buttonsContainer: {
    marginTop: 10,
  },
});
