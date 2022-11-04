import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BackgroundColor, Color, Gray } from "../constants/styles";
import { censorEmail } from "../utils/censorEmail";
import Logo from "../components/Logo";
import { useSelector, useDispatch } from "react-redux";
import { PrimaryButton } from "../components/Button";
import { ErrorBox } from "../components/ErrorBox";
import { verify, reset } from "../features/auth/slice";

export default function VerifyEmailScreen({ navigation }) {
  const { user, isError, isLoading, message } = useSelector(
    (state) => state.auth
  );
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) navigation.navigate("Sign up");
    if (isError) {
      setErrorMessage(message);
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    } else {
      setErrorMessage("");
    }
  }, [isError, message]);

  function handleVerify() {
    if (code.trim().length === 0) {
      setErrorMessage("Please enter your code");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }
    dispatch(verify({ code }));
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
          Almost There
        </Text>
      </View>
      <Logo fontSize={60} block />
      <Text style={styles.bigText}>
        Verification Code has been Sent to{" "}
        <Text style={{ color: "#fff", fontFamily: "Inter-Medium" }}>
          {user && censorEmail(user.email)}
        </Text>
      </Text>
      <KeyboardAvoidingView
        style={styles.form}
        behavior={Platform.OS === "ios" ? "height" : "padding"}
      >
        <TextInput
          style={styles.input}
          placeholder="Verification Code..."
          placeholderTextColor="#C0C0C0"
          keyboardType="numeric"
          value={code}
          onChangeText={(text) => setCode(text)}
        />
        <PrimaryButton
          label={isLoading ? "Loading..." : "Ink In"}
          other={{ marginTop: 20 }}
          onPress={() => handleVerify()}
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
            Did not receive code?{" "}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            styles={{ marginTop: 6 }}
            onPress={() => navigation.navigate("Sign up")}
          >
            <Text
              style={[styles.white, { fontSize: 12, fontFamily: "Inter-Bold" }]}
            >
              Change Email
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
  bigText: {
    color: Color,
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Inter-Regular",
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
  white: {
    color: Color,
  },
});
