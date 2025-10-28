
import { Sketch } from "@uiw/react-color";
import { useState } from "react";
import { Button } from "../ui/button";
import {motion} from "framer-motion"
import { documentStore } from "@/lib/store/documentStore";
const ColorMaker = () => {
    const [color , setColor] = useState("")
   const {setOpenChromePicker,setHighLight,setCustomColors} = documentStore()
    let handleSelectColor = ()=>{
        setHighLight(color)
        setCustomColors(color)
        setOpenChromePicker(false)
    }
    return (
        <>
            <div className="fixed inset-0  z-30" />
            <motion.div
            initial={{scale : 0 , opacity : 0}}
            animate={{opacity : 1 , scale : 1}}
            exit={{ opacity :0 , scale :  0 }}
            transition={{duration : 0.3 , ease : "easeIn"}}
            className="absolute left-1/2 z-40 top-1/2 p-3 w-[300px]  bg-[#1e1e1e] border border-gray-8 rounded-lg  -translate-1/2">
                <Sketch
                    color={color}
                    onChange={(color) => setColor(color.hex)}
                    style={{
                        background: '#1e1e1e',
                        boxShadow : "none",
                        border : "0px",
                        width : "100%"
                    }
                }
                  
                />
                <div className="flex flex-col gap-3">
              
                <div className="flex justify-end gap-4">
                    <Button onClick={()=>setOpenChromePicker(false)} variant={"outline"}>Cancel</Button>
                    <Button onClick={handleSelectColor} variant={"default"}>Ok</Button>
                </div>
               
                </div>

            </motion.div>
        </>
    )
}

export default ColorMaker