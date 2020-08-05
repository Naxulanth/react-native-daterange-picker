import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

const Button = ({ children, onPress, buttonStyle, buttonTextStyle }) => {
  const mergedStyles = {
    button: {
      ...styles.button,
      ...buttonStyle,
    },
    buttonText: {
      ...styles.buttonText,
      ...buttonTextStyle,
    },
  };
  return (
    <TouchableOpacity onPress={onPress} style={mergedStyles.button}>
      <Text style={mergedStyles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bdbdbd",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonText: {},
});

export default Button;
