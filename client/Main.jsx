import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  WelcomeScreen,
  SignUpScreen,
  SignInScreen,
  VerifyEmailScreen,
  Posts,
} from "./src/views";
import { BackgroundColor } from "./src/constants/styles";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
export default function Main() {
  const { user } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#121212" />
      <View
        style={{
          flex: 1,
          paddingVertical: 45,
          backgroundColor: BackgroundColor,
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user?.uid && (
            <Stack.Screen name="Verify email" component={VerifyEmailScreen} />
          )}
          {!user && (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Sign up" component={SignUpScreen} />
              <Stack.Screen name="Sign in" component={SignInScreen} />
            </>
          )}
          {user?.id && (
            <>
              <Stack.Screen name="Posts" component={Posts} />
            </>
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
