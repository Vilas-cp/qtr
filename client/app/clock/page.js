"use client";
import React, { useState,useRef } from "react";
import { Teko } from "next/font/google";

const teko1 = Teko({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const [isSmall, setIsSmall] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const toggleSize = () => {
    setIsSmall((prev) => !prev);
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full h-screen flex-col">
        <div
          className={`bg-[#353738] ${
            isSmall
              ? "px-[15px] py-[2px] rounded-t-[5px] border-[5px]"
              : "px-[15px] py-[4px] rounded-t-[10px] border-[10px]"
          } border-black border-b-0 ml-[240px] cursor-pointer transition-all duration-300`}
          onClick={toggleSize}
        ></div>

        <div className="bg-[#99acf8] h-[250px] w-[400px] rounded-[40px] shadow-2xl flex items-center justify-center border-[10px] border-black flex-col">
          <div className="bg-[#f7f4e5] h-[150px] w-[325px] rounded-[10px] mb-[20px] border-[10px] border-black flex items-center justify-center">
            <div className={teko1.className}>
              <div className="text-[140px] pt-[20px]">{formatTime(time)}</div>
            </div>
          </div>

          <div className="flex w-full gap-[130px] items-center justify-center">
            <div className="flex gap-4">
              {[...Array(3)].map((_, idx) => (
                <button
                  key={idx}
                  className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"
                  aria-label={`Glowing button ${idx + 1}`}
                ></button>
              ))}
            </div>

            <div className="flex">
              <button
                onClick={isRunning ? pauseTimer : startTimer}
                className="h-[25px] w-[50px] bg-red-400 mr-[10px] flex items-center justify-center"
              >
                <div className={teko1.className}>
                  {isRunning ? "Pause" : "Start"}
                </div>
              </button>
              <button
                onClick={resetTimer}
                className="h-[25px] w-[50px] bg-green-200 flex items-center justify-center"
              >
                <div className={teko1.className}>Reset</div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#353738] px-[150px] py-[8px] rounded-b-[10px] border-[10px] border-black border-t-0"></div>
      </div>
    </div>
  );
};

export default Page;
