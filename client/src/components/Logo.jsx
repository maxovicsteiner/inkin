import { View, Text } from "react-native";
import React from "react";
import { BackgroundColor, Color } from "../constants/styles";
import Linear from "./Linear";
import MaskedView from "@react-native-masked-view/masked-view";

export default function Logo(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: props.block ? BackgroundColor : "transparent",
      }}
    >
      <Text
        style={{
          color: Color,
          fontSize: props.fontSize,
          fontFamily: "Handlee-Regular",
        }}
      >
        in
      </Text>
      <MaskedView
        maskElement={
          <Text
            style={{ fontSize: props.fontSize, fontFamily: "Handlee-Regular" }}
          >
            K
          </Text>
        }
      >
        <Linear>
          <Text
            style={{
              fontSize: props.fontSize,
              opacity: 0,
              backgroundColor: "transparent",
            }}
          >
            K
          </Text>
        </Linear>
      </MaskedView>
      <Text
        style={{
          color: Color,
          fontSize: props.fontSize,
          fontFamily: "Handlee-Regular",
        }}
      >
        in
      </Text>
    </View>
  );
}
