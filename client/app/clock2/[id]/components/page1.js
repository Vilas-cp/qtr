"use client";
import React, { useState, useEffect } from "react";
import { Teko } from "next/font/google";
import { sanityClient } from "../../../../sanity";

const teko1 = Teko({ subsets: ["latin"], weight: "400" });

const Page2 = ({ id }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!sanityClient) {
        console.error("sanityClient is not initialized");
        return;
      }

      const query = '*[_type == "task"]';
      const sanityTasks = await sanityClient.fetch(query);
      setTasks(sanityTasks);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const task = tasks.find((task) => task._id === id);
      if (task) {
        setSelectedTask(task);
        console.log("Task found:", task);
        setTime(task.pomodoroSettings.workDuration * 60);
      } else {
        console.log("Task not found");
      }
    }
  }, [tasks, id]);

  const musicTracks = [
    "/music/music1.mp3",
    "/music/music2.mp3",
    "/music/music3.mp3",
    "/music/music4.mp3",
    "/music/music5.mp3",
    "/music/music6.mp3",  // Add new music track
  ];

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

  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [audio, isPlaying]);

  useEffect(() => {
    if (isPlaying && time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (time === 0) {
      setTime(selectedTask.pomodoroSettings.workDuration * 60);
    }
    setHasStarted(true);
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleReset = () => {
    setTime(selectedTask.pomodoroSettings.workDuration * 60);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setHasStarted(false);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleSetTimer = (durationType) => {
    if (selectedTask) {
      const durationInMinutes = selectedTask.pomodoroSettings[durationType];
      setTime(durationInMinutes * 60);
    }
  };

  const handleTimerEnd = async () => {
   
    if (audio) {
      audio.pause();
    }

    
    const endAudio = new Audio("/music/music6.mp3");
    endAudio.play().catch((error) => {
      console.error("Error playing the audio:", error);
    });

    
    const message = "Your timer has finished!";
    const to = "+917892466923"; 

    try {
      const response = await fetch("/api/sendWhatsappMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, to }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData.error);
        return;
      }

      const data = await response.json();
      if (data.success) {
        console.log("WhatsApp message sent successfully:", data);
      } else {
        console.error("Error sending WhatsApp message:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (time === 0 && hasStarted) {
      handleTimerEnd();
    }
  }, [time, hasStarted]);

  return (
    <div>
      <div className="flex items-center justify-center w-full h-screen flex-col">
        <div className="bg-[#353738] px-[15px] py-[4px] rounded-t-[10px] border-[10px] border-black border-b-0 ml-[240px]"></div>
        <div className="bg-[#99acf8] h-[250px] w-[400px] rounded-[40px] shadow-2xl flex items-center justify-center border-[10px] border-black flex-col">
          <div className="bg-[#f7f4e5] h-[150px] w-[325px] rounded-[10px] mb-[20px] border-[10px] border-black flex items-center justify-center">
            <div className={teko1.className}>
              <div className="text-[140px] pt-[20px]">{formatTime(time)}</div>
            </div>
          </div>
          <div className="flex w-full gap-[130px] items-center justify-center">
            <div className="flex gap-4">
              <button
                onClick={() => handleSetTimer("workDuration")}
                className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"
              ></button>
              <button
                onClick={() => handleSetTimer("breakDuration")}
                className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"
              ></button>
              <button
                onClick={() => handleSetTimer("longBreakDuration")}
                className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"
              ></button>
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
      </div>
    </div>
  );
};

export default Page2;
