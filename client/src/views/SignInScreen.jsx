import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BackgroundColor, Color, Gray } from "../constants/styles";
import { PrimaryButton } from "../components/Button";
import { ErrorBox } from "../components/ErrorBox";
import Logo from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { login, reset, logout } from "../features/auth/slice";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { isError, message, isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  function totalReset() {
    dispatch(logout());
    dispatch(reset());
  }

  useEffect(() => {
    if (isError) {
      setErrorMessage(message);
      setTimeout(() => {
        totalReset();
      }, 3000);
    } else {
      setErrorMessage("");
    }
  }, [isError, message]);

  function handleSignin() {
    // Frontend form validation

    if (email.trim().length === 0) {
      setErrorMessage("Please enter your email address");
      setTimeout(() => {
        totalReset();
      }, 3000);
      return;
    }

    if (password.length === 0) {
      setErrorMessage("Please enter your password");
      setTimeout(() => {
        totalReset();
      }, 3000);
      return;
    }

    dispatch(login({ email, password }));
  }

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 20 }}>
        <Text
          style={[
            styles.white,
            {
              fontSize: 15,
              textAlign: "center",
              fontFamily: "Inter-Medium",
              color: "#ccc",
            },
          ]}
        >
          Welcome Back
        </Text>
      </View>
      <Logo fontSize={60} block />
      <KeyboardAvoidingView
        style={styles.form}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TextInput
          style={styles.input}
          placeholder="Email Address..."
          placeholderTextColor="#C0C0C0"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={[styles.input, { marginBottom: 6 }]}
          placeholder="Password..."
          placeholderTextColor="#C0C0C0"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.5}
          styles={{ marginTop: 6 }}
        >
          <Text
            style={[
              styles.white,
              { fontSize: 12, fontFamily: "Inter-Medium", textAlign: "right" },
            ]}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <PrimaryButton
          label={isLoading ? "Loading..." : "Log In"}
          other={{ marginTop: 20 }}
          onPress={() => handleSignin()}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 6,
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              styles.white,
              {
                fontSize: 12,
                textAlign: "center",
                fontFamily: "Inter-Medium",
              },
            ]}
          >
            Don't Have An Account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Sign up")}
            activeOpacity={0.5}
            styles={{ marginTop: 6 }}
          >
            <Text
              style={[styles.white, { fontSize: 12, fontFamily: "Inter-Bold" }]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {errorMessage.length > 0 && (
        <ErrorBox
          error={errorMessage}
          style={{
            borderRadius: 5,
            width: "90%",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BackgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  white: {
    color: Color,
  },
  input: {
    backgroundColor: Gray,
    padding: 10,
    fontSize: 14,
    width: "100%",
    borderRadius: 5,
    color: "#ffffff",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    padding: 20,
    backgroundColor: BackgroundColor,
  },
});
