"use client";

import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import cat_check from "../../../public/animations/cat_check.json";

const LottieWo = () => {
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const playAnimation = () => {
      setShouldPlay(true);
      setTimeout(() => {
        setShouldPlay(false); // Stop the animation after it completes
      }, 5000); // Adjust this to match the duration of the animation
    };

    const interval = setInterval(() => {
      playAnimation();
    }, 8000); // 10 seconds delay after animation completes

    playAnimation(); // Start immediately on mount

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const defaultOptions = {
    loop: false, // Ensure the animation plays only once
    autoplay: true,
    animationData: cat_check,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ width: "200px", height: "500px" }}>
      {shouldPlay ? (
        <Lottie options={defaultOptions} height="500px" width="200px" />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default LottieWo;
