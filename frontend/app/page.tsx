"use client";

import React, { useState } from "react";
import { Loader, Search } from "lucide-react";
import Logo from "./components/Logo";

const CurrencyExchange = () => {
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto font-sans bg-white">
      <div className="w-full h-screen px-10 md:px-[35%] 2xl:px-[40%] pb-[37px] pt-5  flex-col justify-center items-start gap-5 flex">
        <div className="w-[400px]">
          <div
            className="self-stretch justify-between items-center flex sticky top-0 z-10 py-5"
            id="nav"
          >
            <Logo />
          </div>
          <div className="flex flex-col items-start justify-start w-full">
            <text className="text-2xl font-semibold"></text>
            <input
              className="w-full bg-gray-200 h-[40px] rounded-2xl mt-3 px-5 text-sm"
              placeholder="email address"
              type="email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <input
              className="w-full bg-gray-200 h-[40px] rounded-2xl mt-3 px-5 text-sm"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <text className="my-2 text-red-500 text-sm">{error?.error}</text>
            <button
              // onClick={handleLogin}
              className="bg-black text-white py-2 rounded-full mt-3 w-[120px] bg-[#ff4c05] hover:text-[#ff4c05] hover:bg-black transition duration-400"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;
