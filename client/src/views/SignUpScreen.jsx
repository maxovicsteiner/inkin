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
import { register, reset, logout } from "../features/auth/slice";
import { useDispatch, useSelector } from "react-redux";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

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

  function handleSignUp() {
    // Frontend form validation
    if (password !== password2) {
      setErrorMessage("Passwords do not match");
      setTimeout(() => {
        totalReset();
      }, 3000);
      return;
    }

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

    // Send request to backend
    dispatch(register({ email, password }));
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
          Welcome
        </Text>
      </View>
      <Text style={[styles.header, styles.white]}>
        Join Now and <Text style={{ fontFamily: "Inter-Medium" }}>inKin</Text>{" "}
        With Your Community
      </Text>
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
          style={styles.input}
          placeholder="Password..."
          placeholderTextColor="#C0C0C0"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password..."
          placeholderTextColor="#C0C0C0"
          secureTextEntry={true}
          value={password2}
          onChangeText={(text) => setPassword2(text)}
        />

        <PrimaryButton
          label={isLoading ? "Loading... " : "Sign Up"}
          other={{ marginTop: 15 }}
          onPress={() => handleSignUp()}
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
            Already Have An Account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Sign in")}
            activeOpacity={0.5}
            styles={{ marginTop: 6 }}
          >
            <Text
              style={[styles.white, { fontSize: 12, fontFamily: "Inter-Bold" }]}
            >
              Log In
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
  header: {
    fontFamily: "Inter-Regular",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: BackgroundColor,
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
  errorMessage: {
    color: Color,
  },
});
