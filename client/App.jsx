import { Provider } from "react-redux";
import { store } from "./src/app/store";
import Main from "./Main";
import { useFonts } from "expo-font";

const App = () => {
  let [fontsLoaded] = useFonts({
    "Handlee-Regular": require("./assets/fonts/Handlee-Regular.ttf"),
    "Inter-Regular": require("./assets/fonts/static/Inter-Regular.ttf"),
    "Inter-Light": require("./assets/fonts/static/Inter-Light.ttf"),
    "Inter-Medium": require("./assets/fonts/static/Inter-Medium.ttf"),
    "Inter-Bold": require("./assets/fonts/static/Inter-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
