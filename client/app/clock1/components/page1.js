"use client";
import React, { useState, useEffect } from "react";
import { Teko } from "next/font/google";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(() => import("./Lottiecomp"), { ssr: false });
const LottieWork = dynamic(() => import("./LottieWork"), { ssr: false });
const LottieWo = dynamic(() => import("./CatChecked"), { ssr: false });
const teko1 = Teko({ subsets: ["latin"], weight: "400" });

const Page2 = () => {
  const musicTracks = [
    "/music/music1.mp3",
    "/music/music2.mp3",
    "/music/music3.mp3",
    "/music/music4.mp3",
    "/music/music5.mp3",
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio, setAudio] = useState(null);
  const [time, setTime] = useState(0.1 * 60); // Start with 25 minutes for work
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [sessionType, setSessionType] = useState("Work");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioInstance = new Audio(musicTracks[currentTrackIndex]);
      audioInstance.loop = false;

      audioInstance.onended = () => {
        if (currentTrackIndex < musicTracks.length - 1) {
          setCurrentTrackIndex((prevIndex) => prevIndex + 1);
        } else {
          setCurrentTrackIndex(0);
        }
      };

      setAudio((prevAudio) => {
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.src = "";
        }
        return audioInstance;
      });
    }
  }, [currentTrackIndex]);

  // Play/pause the audio when `isPlaying` changes
  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [audio, isPlaying]);

  // Timer decrement logic
  useEffect(() => {
    if (isPlaying && time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (time === 0) {
      handleSessionChange();
    }
  }, [isPlaying, time]);

  const handleSessionChange = () => {
    if (isWorkTime) {
      setTime(5 * 60);
      setIsWorkTime(false);
      setSessionType("Break");
      confetti();

      sendMessage("It's break time! Take a rest!");
    } else {
      setTime(25 * 60);
      setIsWorkTime(true);
      setSessionType("Work");

      sendMessage("It's work time! Get back to focus!");
    }
  };

  const sendMessage = async (message) => {
    const toNumber = "+917892466923";

    try {
      const response = await fetch("/api/sendagain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          to: toNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (time === 0) {
      setTime(25 * 60); // Reset timer to work time
    }

    setIsPlaying((prevIsPlaying) => !prevIsPlaying); // Toggle play state
  };

  const handleReset = () => {
    setTime(25 * 60); // Reset timer to work time
    setCurrentTrackIndex(0); // Reset to the first track
    setIsPlaying(false);
    setIsWorkTime(true); // Reset to work session
    setSessionType("Work"); // Reset session type text

    if (audio) {
      audio.pause(); // Stop music
      audio.currentTime = 0; // Reset audio position
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full h-screen flex-col relative">
        <div className="bg-[#353738] px-[15px] py-[4px] rounded-t-[10px] border-[10px] border-black border-b-0 ml-[240px]"></div>
        <div className="bg-[#99acf8] h-[250px] w-[400px] rounded-[40px] shadow-2xl flex items-center justify-center border-[10px] border-black flex-col">
          <div className="bg-[#f7f4e5] h-[150px] w-[325px] rounded-[10px] mb-[20px] border-[10px] border-black flex items-center justify-center">
            <div className={teko1.className}>
              <div className="text-[140px] pt-[20px]">{formatTime(time)}</div>
            </div>
          </div>
          <div className="flex w-full gap-[130px] items-center justify-center">
            <div className="flex gap-4">
              <button className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"></button>
              <button className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"></button>
              <button className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"></button>
            </div>

            <div className="flex">
              {isPlaying ? (
                <button
                  onClick={handleStart}
                  className="h-[25px] w-[50px] bg-green-200 mr-[10px] flex items-center justify-center"
                >
                  <div className={teko1.className}>Pause</div>
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="h-[25px] w-[50px] bg-red-400 mr-[10px] flex items-center justify-center"
                >
                  <div className={teko1.className}>Start</div>
                </button>
              )}
              <button
                onClick={handleReset}
                className="h-[25px] w-[50px] bg-blue-400 flex items-center justify-center"
              >
                <div className={teko1.className}>Reset</div>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#353738] px-[150px] py-[8px] rounded-b-[10px] border-[10px] border-black border-t-0"></div>
        <div className="text-xl pt-[10px]">{sessionType}</div>{" "}
        {/* Display Work/Break next to clock */}
        <div className="absolute top-0 right-[200px]" suppressHydrationWarning>
          {isWorkTime ? <LottieWork /> :<LottieAnimation/> }
        </div>
        <div className="absolute bottom-10 left-[200px]" suppressHydrationWarning>
          <LottieWo />
        </div>
      </div>
    </div>
  );
};

export default Page2;
