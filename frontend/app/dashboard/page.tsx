"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CurrencyConverter from "@/app/components/CurrencyConverter";
import TransactionHistory from "@/app/components/TransactionHistory";
import { RootState } from "../lib/store";
import Nav from "../components/Nav";
import { logout } from "../lib/features/authSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="w-full h-[832px] px-7 md:px-[250px] pb-[37px] pt-5 flex-col justify-start items-start gap-5 flex">
      <Nav handleLogout={handleLogout} />
      <div className="flex flex-col gap-5 w-full">
        <CurrencyConverter />
        <TransactionHistory />
      </div>
    </div>
  );
}
