"use client";

import React from "react";
import Lottie from "react-lottie";
import work from "../../../public/animations/work.json"

const LottieWork = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: work,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Lottie options={defaultOptions} height="300px" width="300px" />
    </div>
  );
};

export default LottieWork;