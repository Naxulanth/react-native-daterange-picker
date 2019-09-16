import React, { Component, Fragment } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { Dimensions } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";
import momentDefault from "moment";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

export default class DateRangePicker extends Component {
  constructor(props) {
    moment = props.moment || momentDefault;
    super(props);
    this.state = {
      isOpen: false,
      days: [],
      selecting: false
    };
  }

  componentDidMount() {
    this.populate();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const {
      open,
      onChange,
      displayedDate,
      startDate,
      endDate,
      date
    } = this.props;
    if (!isEqual(prevProps, this.props)) {
      this.populate();
    }
  }

  populate = () => {
    const {
      displayedDate,
      startDate,
      endDate,
      selectedStyle,
      selectedTextStyle,
      minDate,
      maxDate,
      disabledStyle,
      dayStyle,
      dayTextStyle,
      disabledTextStyle
    } = this.props;
    const dayStyles = {
      ...styles.dayDefaults,
      ...styles.day,
      ...dayStyle
    };
    const dayTextStyles = {
      ...styles.dayTextDefaults,
      ...styles.dayText,
      ...dayTextStyle
    };
    const disabledStyles = {
      ...styles.selectedDefaults,
      ...styles.disabled,
      ...disabledStyle
    };
    const disabledTextStyles = { ...styles.disabledText, ...disabledTextStyle };
    const selectedStyles = {
      ...styles.selectedDefaults,
      ...styles.selected,
      ...selectedStyle
    };
    const selectedTextStyles = { ...styles.selectedText, ...selectedTextStyle };
    let days = [];
    for (let i = 1; i <= displayedDate.daysInMonth(); ++i) {
      let date = moment(displayedDate).set("date", i);
      let selected =
        (startDate &&
          endDate &&
          date.isBetween(startDate, endDate, null, "[]")) ||
        (startDate && date.isSame(startDate, "day")) ||
        (this.props.date && date.isSame(this.props.date, "day"));
      let disabled =
        (minDate && date.isBefore(minDate, "day")) ||
        (maxDate && date.isAfter(maxDate, "day"));
      days.push(
        <TouchableOpacity key={i} onPress={() => !disabled && this.select(i)}>
          <View style={styles.day}>
            <View
              style={{
                ...(!disabled && !selected && dayStyles),
                ...(selected && selectedStyles),
                ...(disabled && disabledStyles)
              }}
            >
              <Text
                style={{
                  ...(!disabled && !selected && dayTextStyles),
                  ...(selected && selectedTextStyles),
                  ...(disabled && disabledTextStyles)
                }}
              >
                {i}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    this.setState({
      days
    });
  };

  select = day => {
    const { range, displayedDate, endDate, startDate, onChange } = this.props;
    const { selecting } = this.state;
    let date = moment(displayedDate);
    date.set("date", day);
    if (range) {
      if (selecting) {
        if (date.isBefore(startDate)) {
          this.setState(
            {
              selecting: true
            },
            () => onChange({ startDate: date })
          );
        } else
          this.setState(
            {
              selecting: !selecting
            },
            () => onChange({ endDate: date })
          );
      } else {
        this.setState(
          {
            selecting: !selecting
          },
          () => onChange({ date: null, endDate: null, startDate: date })
        );
      }
    } else {
      onChange({
        date: date,
        startDate: null,
        endDate: null
      });
    }
  };

  onOpen = () => {
    this.setState({
      isOpen: true
    });
  };

  onClose = () => {
    const { startDate, endDate, onChange } = this.props;
    this.setState({
      isOpen: false,
      selecting: false
    });
    if (!endDate) {
      onChange({
        endDate: startDate
      });
    }
  };

  previousMonth = () => {
    const { displayedDate, onChange } = this.props;
    onChange({
      displayedDate: moment(displayedDate).subtract(1, "months")
    });
  };

  nextMonth = () => {
    const { displayedDate, onChange } = this.props;
    onChange({
      displayedDate: moment(displayedDate).add(1, "months")
    });
  };

  render() {
    const {
      backdropStyle,
      containerStyle,
      headerTextStyle,
      monthButtonsStyle,
      headerStyle,
      monthPrevButton,
      monthNextButton,
      children,
      displayedDate
    } = this.props;
    const { isOpen, days } = this.state;
    const mergedStyles = {
      backdrop: {
        ...styles.backdropDefaults,
        ...styles.backdrop,
        ...backdropStyle
      },
      container: {
        ...styles.containerDefaults,
        ...styles.container,
        ...containerStyle
      },
      header: {
        ...styles.headerDefaults,
        ...styles.header,
        ...headerStyle
      },
      headerText: {
        ...styles.headerTextDefaults,
        ...styles.headerText,
        ...headerTextStyle
      },
      monthButtons: {
        ...styles.monthButtonsDefaults,
        ...styles.monthButtons,
        ...monthButtonsStyle
      }
    };
    let node = (
      <View>
        <TouchableWithoutFeedback onPress={this.onOpen}>
          {children ? children : <View></View>}
        </TouchableWithoutFeedback>
      </View>
    );
    return isOpen ? (
      <Fragment>
        <View style={mergedStyles.backdrop}>
          <TouchableWithoutFeedback
            style={styles.closeTrigger}
            onPress={this.onClose}
          >
            <View style={styles.closeContainer} />
          </TouchableWithoutFeedback>
          <View>
            <View style={mergedStyles.container}>
              <View style={styles.header}>
                <TouchableOpacity onPress={this.previousMonth}>
                  {monthPrevButton || (
                    <FontAwesomeIcon
                      size={mergedStyles.monthButtons.fontSize}
                      color={mergedStyles.monthButtons.color}
                      style={mergedStyles.monthButtons}
                      icon={faChevronLeft}
                    />
                  )}
                </TouchableOpacity>
                <Text style={mergedStyles.headerText}>
                  {displayedDate.format("MMMM") +
                    " " +
                    displayedDate.format("YYYY")}
                </Text>
                <TouchableOpacity onPress={this.nextMonth}>
                  {monthPrevButton || (
                    <FontAwesomeIcon
                      size={mergedStyles.monthButtons.fontSize}
                      color={mergedStyles.monthButtons.color}
                      style={mergedStyles.monthButtons}
                      icon={faChevronRight}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.days}>{days}</View>
            </View>
          </View>
        </View>
        {node}
      </Fragment>
    ) : (
      <Fragment>{node}</Fragment>
    );
  }
}

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  displayedDate: PropTypes.object,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  backdropStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  monthButtonsStyle: PropTypes.object,
  dayTextStyle: PropTypes.object,
  dayStyle: PropTypes.object,
  headerStyle: PropTypes.object
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  backdropDefaults: {
    position: "absolute",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2147483647
  },
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    width: width * 0.85,
    height: height * 0.42
  },
  closeTrigger: {
    width: width,
    height: height
  },
  closeContainer: {
    width: "100%",
    height: "100%",
    position: "absolute"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#efefef",
    borderBottomWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 15
  },
  headerText: {
    fontSize: 16,
    color: "black"
  },
  monthButtons: {
    fontSize: 16,
    color: "black"
  },
  day: {
    width: width * 0.09,
    height: height * 0.065,
    alignItems: "center",
    justifyContent: "center"
  },
  dayText: {
    fontSize: 16,
    textAlign: "center"
  },
  days: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    flexWrap: "wrap"
  },
  selected: {
    backgroundColor: "#3b83f7",
    width: "90%",
    height: "80%",
    borderRadius: 8
  },
  selectedText: {
    color: "white"
  },
  selectedDefaults: {
    alignItems: "center",
    justifyContent: "center"
  },
  disabledText: {
    opacity: 0.5
  }
});
