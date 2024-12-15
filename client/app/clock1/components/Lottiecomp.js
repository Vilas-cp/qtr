"use client";

import React from "react";
import Lottie from "react-lottie";
import chilled from "../../../public/animations/chilled.json";

const LottieAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: chilled,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Lottie options={defaultOptions} height="200px" width="200%" />
    </div>
  );
};

export default LottieAnimation;
