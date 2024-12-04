import Logo from "./Logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Nav = () => {
  const [user, setUser] = useState<any>();
  return (
    <div
      className="self-stretch justify-between items-center flex sticky top-0 z-10 py-5"
      id="nav"
    >
      <Logo />
      <div className="flex flex-row items-center gap-4">
        {/* <Link
          href={"/dashboard"}
          className="text-sm hover:underline hover:text-black text-zinc-600"
        >
          Dashboard
        </Link> */}
        <Popover>
          <PopoverTrigger>
            <img
              src="/user.png"
              className="w-10 h-10 relative bg-[#d7d7d5] rounded-[100px]"
            />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex flex-col w-[200px] border-none p-2 py-4"
          >
            <text className="text-xs text-gray-500 px-2">Welcome</text>
            <text className="text-sm px-2">{user?.email}</text>

            <div
              onClick={() => {
                setUser(null);
                sessionStorage.clear();
              }}
              className="flex justify-start items-center gap-2 h-8 mt-2 hover:bg-[#000000]/10 rounded-lg px-2 py-1 cursor-pointer"
            >
              <LogOut size={15} />
              <text className="text-xs font-medium">Logout</text>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Nav;
