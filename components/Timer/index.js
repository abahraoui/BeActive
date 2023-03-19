import React from "react";
import CountDown from "react-native-countdown-component";

const Timer = (props) => {
  return (
    <CountDown
      until={props.duration}
      size={40}
      digitStyle={{ backgroundColor: "#000" }}
      digitTxtStyle={{ color: "#FFF" }}
      timeToShow={["S"]}
      onFinish={props.onComplete}
    />
  );
};

export default Timer;
