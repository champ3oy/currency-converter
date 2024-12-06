"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useConvertMutation, useGetExchangeRatesQuery } from "../lib/api";
import { debounce } from "lodash";
import { getFlagEmoji } from "../lib/currency-utils";

const conversionSchema = z.object({
  fromCurrency: z.string().default("USD"),
  toCurrency: z.string().default("GHS"),
  amount: z.number().positive().default(0),
});

export default function CurrencyConverter() {
  const { data: rates } = useGetExchangeRatesQuery();
  const [convert] = useConvertMutation();
  const [convertedAmount, setConvertedAmount] = useState<any>("");

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      fromCurrency: "USD",
      toCurrency: "GHS",
      amount: "",
    },
  });

  const amount = watch("amount");
  const fromCurrency = watch("fromCurrency");
  const toCurrency = watch("toCurrency");

  const debouncedConvert = debounce(async () => {
    try {
      const result = await convert({
        amount,
        fromCurrency,
        toCurrency,
      }).unwrap();
      setConvertedAmount(result.convertedAmount);
    } catch (error) {
      console.error("Conversion failed:", error);
    }
  }, 300);

  useEffect(() => {
    if (Number(amount) > 0) {
      debouncedConvert();
    }
    return () => debouncedConvert.cancel();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="w-full  flex-col justify-center items-center gap-5 flex">
      <div className="w-full flex flex-col justify-between gap-5 items-center w-full">
        <div className="relative w-full md:w-[400px] border p-4 rounded-xl flex flex-row justify-between">
          <div>
            <label className="font-medium text-zinc-400 text-sm">Amount</label>
            <div className="font-black text-3xl flex gap-2">
              <input
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
                className="outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src={getFlagEmoji(fromCurrency)} className="w-8 h-8" />
            <select
              {...register("fromCurrency")}
              value={fromCurrency}
              className="font-bold text-2xl outline-none appearance-none bg-transparent pr-8 cursor-pointer"
            >
              {Object.keys(rates || {}).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-[400px] border p-4 rounded-xl flex flex-row justify-between">
          <div>
            <label className="font-medium text-zinc-400 text-sm">
              Converted to
            </label>
            <div className="font-black text-3xl flex gap-2">
              <input
                value={convertedAmount}
                readOnly
                className="outline-none w-full"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src={getFlagEmoji(toCurrency)} className="w-8 h-8" />
            <select
              {...register("toCurrency")}
              value={toCurrency}
              className="font-bold text-2xl outline-none appearance-none bg-transparent pr-8 cursor-pointer"
            >
              {Object.keys(rates || {}).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
