"use client";

import React from "react";
import Lottie from "react-lottie";
import load from "../../public/animations/load.json";

const LottieAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: load,
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
