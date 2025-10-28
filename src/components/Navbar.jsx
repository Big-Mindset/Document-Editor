"use client"
import { DocumentLogo } from "@/assets/svgs";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { NotificationInbox } from "./editor/LiveblocksNotifications";
import Image from "next/image";
import { Avatar } from "./Avatar";

export default function Navbar({ user }) {
    let [focus, setFocus] = useState(false)
    let [inbox, setInbox] = useState(false)

    console.log(user);
    
    return (
        <nav className="flex justify-between items-center  px-9 h-16 fixed top-0   w-full">
            <div className="flex items-center gap-3">
                <span>
                    {DocumentLogo}
                </span>
                <span className="text-2xl text-gray-1">Docs</span>
            </div>
            <div className={`flex gap-4 rounded-full   text-gray-2 ring-transparent  ${focus ? "focus-within:ring-gray-3 bg-gray-10" : "hover:ring-gray-6"} ring-1 duration-50 transition-colors items-center p-2 hidden  w-full  sm:flex sm:max-w-[400px] md:max-w-[500px] lg:max-w-[900px] bg-gray-7 overflow-hidden`}>
                <Search size={20} />
                <input onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="w-full border-none outline-none placeholder:text-gray-2" placeholder="Search" />
            </div>
            <div className="flex gap-1.5 items-center">

                <div onClick={() => setInbox(!inbox)} className="p-2 bg-gray-8 hover:bg-gray-9 rounded-full">
                    <Bell size={20} />
                </div>
                {inbox &&
                    <NotificationInbox />
                }
                <div className="relative">
                    {user?.image ?

                        <div className="overflow-hidden rounded-full bg-gray-9 size-10">
                            <Image src={user?.image} alt={user?.name} height={100} width={100} />

                        </div>
                        : <Avatar name={user?.name[0]} />
                    }
                </div>
            </div>
        </nav>
    )
}