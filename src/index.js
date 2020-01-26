import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isEqual } from "lodash";
import momentDefault from "moment";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

export default class DateRangePicker extends Component {
  constructor(props) {
    moment = props.moment || momentDefault;
    super(props);
    this.state = {
      isOpen: false,
      weeks: [],
      selecting: false,
      dayHeaders: []
    };
  }

  componentDidMount() {
    this.populate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps, this.props)) {
      this.populate();
    }
  }

  populate = () => {
    let dayHeaders = this.populateHeaders();
    let weeks = this.populateWeeks();
    this.setState({
      dayHeaders,
      weeks
    });
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

  selected = date => {
    const { startDate, endDate } = this.props;
    return (
      (startDate &&
        endDate &&
        date.isBetween(startDate, endDate, null, "[]")) ||
      (startDate && date.isSame(startDate, "day")) ||
      (this.props.date && date.isSame(this.props.date, "day"))
    );
  };

  disabled = date => {
    const { minDate, maxDate } = this.props;
    return (
      (minDate && date.isBefore(minDate, "day")) ||
      (maxDate && date.isAfter(maxDate, "day"))
    );
  };

  generateDay = (i, selected, disabled) => {
    const {
      selectedStyle,
      selectedTextStyle,
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
    return (
      <TouchableOpacity
        key={"day-" + i}
        onPress={() => !disabled && this.select(i)}
      >
        <View style={styles.day}>
          <View
            style={{
              ...dayStyles,
              ...(selected && selectedStyles),
              ...(disabled && disabledStyles)
            }}
          >
            <Text
              style={{
                ...dayTextStyles,
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
  };

  populateHeaders = () => {
    let dayHeaders = [];
    const { dayHeaderTextStyle, dayHeaderStyle, displayedDate } = this.props;
    const dayHeaderStyles = {
      ...styles.dayHeaderDefaults,
      ...styles.dayHeader,
      ...dayHeaderStyle
    };
    const dayHeaderTextStyles = {
      ...styles.dayHeaderTextDefaults,
      ...styles.dayHeaderText,
      ...dayHeaderTextStyle
    };
    for (let i = 0; i <= 6; ++i) {
      let day = moment(displayedDate)
        .day(i)
        .format("dddd")
        .substr(0, 2);

      dayHeaders.push(
        <View key={"headers-" + i} style={dayHeaderStyles}>
          <Text style={dayHeaderTextStyles}>{day}</Text>
        </View>
      );
    }
    return dayHeaders;
  };

  populateWeeks = () => {
    const { displayedDate } = this.props;
    let weeks = [];
    let week = [];
    let daysInMonth = displayedDate.daysInMonth();
    let startOfMonth = moment(displayedDate).set("date", 1);
    let offset = startOfMonth.day();
    week = week.concat(
      Array.from({ length: offset }, (x, i) => (
        <View key={"empty-" + i} style={styles.day}></View>
      ))
    );
    for (let i = 1; i <= daysInMonth; ++i) {
      let date = moment(displayedDate).set("date", i);
      let selected = this.selected(date);
      let disabled = this.disabled(date);
      let day = this.generateDay(i, selected, disabled);
      week.push(day);
      if ((i + offset) % 7 === 0 || i === daysInMonth) {
        if (week.length < 7)
          week = week.concat(
            Array.from({ length: 7 - week.length }, (x, i) => (
              <View key={"empty-" + i} style={styles.day}></View>
            ))
          );
        weeks.push(
          <View key={"weeks-" + i} style={styles.week}>
            {week}
          </View>
        );
        week = [];
      }
    }
    return weeks;
  };

  select = day => {
    const { range, displayedDate, startDate, onChange } = this.props;
    const { selecting } = this.state;
    let date = moment(displayedDate);
    date.set("date", day);
    if (range) {
      if (selecting) {
        if (date.isBefore(startDate, "day")) {
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
    const { isOpen, weeks, dayHeaders } = this.state;
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
                  {monthNextButton || (
                    <FontAwesomeIcon
                      size={mergedStyles.monthButtons.fontSize}
                      color={mergedStyles.monthButtons.color}
                      style={mergedStyles.monthButtons}
                      icon={faChevronRight}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.calendar}>
                {this.props.dayHeaders && (
                  <View style={styles.dayHeaderContainer}>{dayHeaders}</View>
                )}
                {weeks}
              </View>
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

DateRangePicker.defaultProps = {
  dayHeaders: true,
  range: false
};

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
    width: width * 0.85
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
  calendar: {
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    padding: 10
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
    justifyContent: "center"
  },
  dayHeader: {
    width: width * 0.09,
    height: height * 0.03,
    justifyContent: "center"
  },
  dayHeaderText: {
    opacity: 0.6,
    textAlign: "center"
  },
  dayHeaderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 10
  },
  dayText: {
    fontSize: 16,
    textAlign: "center"
  },
  week: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  selected: {
    backgroundColor: "#3b83f7",
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
    opacity: 0.3
  }
});
