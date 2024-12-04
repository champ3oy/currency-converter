"use client";

import React, { useState } from "react";
import Nav from "../components/Nav";
import { ChevronDown } from "lucide-react";
import ArrowDataTransferHorizontalIcon from "../components/ExchangeIcon";

const CurrencyExchange = () => {
  return (
    <div className="w-full h-[832px] px-7 md:px-[250px] pb-[37px] pt-5  flex-col justify-start items-start gap-5 flex">
      <Nav />

      <div className="">
        <h1 className="font-black text-[15vh] text-black/10 leading-none">
          CURRENCY
        </h1>
        <h1 className="font-black text-[15vh] text-black/10 leading-none -mt-8">
          CONVERTER
        </h1>
      </div>

      <div className="flex justify-between gap-5 items-center">
        <div className="border p-4 rounded-xl flex flex-row">
          <div className="">
            <label className="font-medium text-zinc-400 text-sm">Amount</label>
            <div className="font-black text-3xl flex gap-2">
              <input placeholder="0.00" className="outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-500" />
            <text className="font-bold text-3xl flex gap-2">USD</text>
            <ChevronDown />
          </div>
        </div>
        <ArrowDataTransferHorizontalIcon />
        <div className="border p-4 rounded-xl flex flex-row">
          <div className="">
            <label className="font-medium text-zinc-400 text-sm">
              Converted to
            </label>
            <div className="font-black text-3xl flex gap-2">
              <input placeholder="0.00" className="outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-yellow-500" />
            <text className="font-bold text-3xl flex gap-2">GHS</text>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="text-xs text-black/50 -mt-3">
        Rates are powered by Open Exchange Rate
      </div>

      <div className="w-full mt-5">
        <text>History</text>

        <div className="w-full flex justify-between py-3 bg-zinc-200 rounded-t-xl px-5 mt-3">
          <text className="min-w-[100px] text-zinc-600 text-sm">Date</text>
          <text className="min-w-[100px] text-zinc-600 text-sm">From</text>
          <text className="min-w-[100px] text-zinc-600 text-sm">Amount</text>
          <text className="min-w-[100px] text-zinc-600 text-sm">
            Convert Currency
          </text>
          <text className="min-w-[100px] text-zinc-600 text-sm">
            Convert Amount
          </text>
          <text className="min-w-[100px] text-zinc-600 text-sm">Rate</text>
        </div>

        {[1, 2, 3, 4]?.map((x, i) => {
          const isEven = x % 2 == 0;
          return (
            <div
              key={i}
              className={`w-full flex justify-between py-3 ${
                isEven ? "bg-zinc-100" : "bg-white"
              } px-5`}
            >
              <text className="min-w-[100px] text-zinc-600 text-sm">
                10 Jul, 2024
              </text>
              <text className="min-w-[100px] text-zinc-600 text-sm">
                10,000
              </text>
              <text className="min-w-[100px] text-zinc-600 text-sm">USD</text>
              <text className="min-w-[100px] text-zinc-600 text-sm">
                160,000
              </text>
              <text className="min-w-[100px] text-zinc-600 text-sm">GHS</text>
              <text className="min-w-[100px] text-zinc-600 text-sm">Rate</text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrencyExchange;
