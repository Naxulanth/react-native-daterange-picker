import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { height, width } from "../../modules";

const Day = ({
  index,
  selected,
  disabled,
  select,
  selectedStyle,
  selectedTextStyle,
  disabledStyle,
  dayStyle,
  dayTextStyle,
  disabledTextStyle,
  empty,
}) => {
  const selectThis = () => {
    if (!disabled) {
      select(index);
    }
  };
  const dayStyles = {
    ...styles.day,
    ...dayStyle,
  };
  const dayTextStyles = {
    ...styles.dayText,
    ...dayTextStyle,
  };
  const disabledStyles = {
    ...styles.disabled,
    ...disabledStyle,
  };
  const disabledTextStyles = {
    ...styles.disabledText,
    ...disabledTextStyle,
  };
  const selectedStyles = {
    ...styles.selected,
    ...selectedStyle,
  };
  const selectedTextStyles = {
    ...styles.selectedText,
    ...selectedTextStyle,
  };
  return (
    <TouchableOpacity key={"day-" + index} onPress={empty ? null : selectThis}>
      <View style={styles.day}>
        <View
          style={{
            ...dayStyles,
            ...(selected && selectedStyles),
            ...(disabled && disabledStyles),
          }}
        >
          <Text
            style={{
              ...dayTextStyles,
              ...(selected && selectedTextStyles),
              ...(disabled && disabledTextStyles),
            }}
          >
            {index}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  day: {
    width: width * 0.09,
    height: height * 0.065,
    justifyContent: "center",
  },
  dayText: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
  },
  selected: {
    backgroundColor: "#3b83f7",
    height: "80%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    color: "white",
  },
  disabledText: {
    opacity: 0.3,
  },
  disabled: {},
});
