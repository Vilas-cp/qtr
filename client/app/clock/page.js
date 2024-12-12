import React from "react";
import { Teko } from "next/font/google";

const teko1 = Teko({ subsets: ["latin"], weight: "400" });

const Page = () => {
  return (
    <div>
      <div className="flex items-center justify-center w-full h-screen flex-col">
        <div className="bg-[#353738]  px-[15px] py-[4px] rounded-t-[10px] border-[10px] border-black border-b-0 ml-[240px]"></div>
        <div className="bg-[#99acf8] h-[250px] w-[400px] rounded-[40px] shadow-2xl flex items-center justify-center border-[10px] border-black flex-col">
          <div className="bg-[#f7f4e5] h-[150px] w-[325px] rounded-[10px] mb-[20px] border-[10px] border-black flex items-center justify-center">
            <div className={teko1.className}>
              <div className="text-[140px] pt-[20px]">00:00</div>
            </div>
          </div>
          <div className="flex w-full gap-[130px] items-center justify-center">
            <div className="flex gap-4">
              <button className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"></button>
              <button className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"></button>
              <button className="w-2 h-2 bg-[#feb602] rounded-full shadow-[0_0_10px_#feb602,0_0_20px_#feb602,0_0_30px_#feb602]"></button>
            </div>

            <div className="flex">
              <button className="h-[25px] w-[50px] bg-red-400 mr-[10px] flex items-center justify-center">
                <div className={teko1.className}>Start</div>
              </button>
              <button className="h-[25px] w-[50px] bg-green-200 flex items-center justify-center">
                <div className={teko1.className}>Pause</div>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#353738]  px-[150px] py-[8px] rounded-b-[10px] border-[10px] border-black border-t-0"></div>
      </div>
    </div>
  );
};

export default Page;
