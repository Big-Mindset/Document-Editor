import { ArrowUpRightFromSquare, Trash, Type } from "lucide-react";
import { DialogTrigger } from "./ui/dialog";
import Link from "next/link";


export default function EditingDocument({setType,roomId}) {
    return (
        <div className={"w-[250px] mt-2"}>
            <div className={"flex flex-col "}>

                <DialogTrigger onClick={() => setType("rename")} asChild>

                    <div className="flex items-center cursor-pointer rounded-lg hover:bg-gray-9 py-3 px-2  gap-3">
                        <Type className="inline-block" size={14} />
                        <p>Rename</p>
                    </div>
                </DialogTrigger>


                <DialogTrigger onClick={() => setType("delete")} asChild>
                    <div className="flex items-center cursor-pointer rounded-lg hover:bg-gray-9 py-3 px-2  gap-3">
                        <Trash className="inline-block" size={14} />
                        <p>Delete</p>
                    </div>
                </DialogTrigger>

                
                <Link href={`/document/${roomId}`} target="_blank">
                <div className="flex items-center cursor-pointer rounded-lg hover:bg-gray-9 py-3 px-2  gap-3">
                    <ArrowUpRightFromSquare className="inline-block" size={14} />
                    <p>Open in new tab</p>
                </div>
                </Link>
            </div>
        </div>
    )
} 