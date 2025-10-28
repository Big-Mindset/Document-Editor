"use client"

import { DocumentLogo } from "@/assets/svgs";
import { DeleteDocument } from "@/components/delete-document";
import { ShareDocument } from "@/components/ShareDocument";
import { Input } from "@/components/ui/input";
import { updateDocument } from "@/lib/actions/create-room";
import { roomStore } from "@/lib/store/roomStore";
import { Edit, MoreVertical, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

export default function Navbar() {

    const Metadata = roomStore((s) => s.metadata, shallow)
    const roomId = roomStore((s) => s.roomId)
    let router = useRouter()
    const [settings, setSettings] = useState(false)
    const [Title, setTitle] = useState(Metadata.title || "Untitled")
    const [Editing, setEdit] = useState(false)
    const saveIfChanged = useCallback(async () => {
        const newTitle = Title.trim() || "Untitled"
        if (newTitle !== Metadata.title) {
            await updateDocument(roomId, newTitle);
        }
    }, [Title, roomId]);
    useEffect(() => {
        let handleEdit = async (e) => {
            if (e.key === "Enter" && Editing) {
                setEdit(false)
                await saveIfChanged()
            }
        }

        let handleMouseDown = async (e) => {
            if (Editing && !inputRef.current?.contains(e.target)) {
                setEdit(false)

                await saveIfChanged()


            }
        }

        window.addEventListener("keydown", handleEdit)
        window.addEventListener("mousedown", handleMouseDown)

        return () => {
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("keydown", handleEdit)
        }
    }, [Editing, saveIfChanged])


    let inputRef = useRef()

    useEffect(() => {
        if (Editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [Editing])
    return (
        <div className="fixed left-0 top-0  right-0 bg-gray-11 flex z-30 pt-5 justify-between items-center px-20 gap-2">
            <div className="flex items-center gap-2.5">
                {DocumentLogo}
                <p className="text-xl">Docs</p>
            </div>
            <div className="flex gap-1.5 items-center">
                {Editing ?
                    <Input
                        ref={inputRef}
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={Title}
                        className="min-w-[78px] flex-1 border-none bg-transparent px-0 text-2xl text-left  font-semibold leading-[24px] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:text-black sm:text-xl md:text-center"
                    /> :
                    <p className="text-2xl font-medium px-2">
                        {Title}
                    </p>
                }
                {!Editing &&
                    <Edit
                        onClick={() => setEdit(true)}
                        className="cursor-pointer p-1 rounded"
                        size={30}
                    />
                }
            </div>
            <div className="flex items-center gap-3 ">
                <ShareDocument />
                <div onClick={()=>setSettings(!settings)} className="rounded-full p-2 bg-gray-10 hover:bg-gray-8 cursor-pointer">
                    <MoreVertical size={16} />
                </div>
                {settings &&
                <div className="absolute top-17 p-2 bg-gray-10 right-30 overflow-auto w-full max-w-[160px]">
                    <div className="space-y-1">
                        <div onClick={()=>router.push("/")} className="p-2 hover:bg-gray-8 cursor-pointer rounded-lg flex gap-1.5 items-center bg-gray-9">
                            <X  size={14} />
                            <span>Close</span>
                        </div>
                        <DeleteDocument />
                    </div>
                </div>
                }
            </div>

        </div>
    );
}