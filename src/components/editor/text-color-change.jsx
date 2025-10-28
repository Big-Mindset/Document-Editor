import { $patchStyleText } from '@lexical/selection';

import { highlightColors } from "@/utils/toolbarObj"
import { PopoverClose } from "@radix-ui/react-popover"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Check, Pipette, PlusCircle } from "lucide-react"
import { documentStore } from "@/lib/store/documentStore"
import { useEffect, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { createCommand, $getSelection, $isRangeSelection } from "lexical";
import { memo } from 'react';

const APPLY_TEXTCOLOR_COMMAND = createCommand("APPLY_TEXTCOLOR_COMMAND");
 function  TextColorEditor({ itemIcon }) {
    let {  textColor, setTextColor, setTextCustomColors, TextCustomColors , setOpenChromePicker,setPrevColor } = documentStore()
    let [editor] = useLexicalComposerContext()
    function getCheckColor(bgColor) {
        bgColor = bgColor.replace("#", "");
        const r = parseInt(bgColor.substr(0, 2), 16);
        const g = parseInt(bgColor.substr(2, 2), 16);
        const b = parseInt(bgColor.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "#000000" : "#FFFFFF";
    }
    let handleOpenPicker = async () => {
        let eyeDropper = new window.EyeDropper();

        const result = await eyeDropper.open();
        let selectedColor = result.sRGBHex
        setTextCustomColors(selectedColor)
        setTextColor(selectedColor)
        setPrevColor(selectedColor)
            if (textColor) {
            editor.dispatchCommand(APPLY_TEXTCOLOR_COMMAND, { color : selectedColor });

        } else {
            editor.dispatchCommand(APPLY_TEXTCOLOR_COMMAND, { color: null });
        }
    }
    console.log("hello");
    
    
    useEffect(() => {
        
        return editor.registerCommand(
            APPLY_TEXTCOLOR_COMMAND,
            (payload) => {
                const { color } = payload;
                const selection = $getSelection();
                
                if ($isRangeSelection(selection)) {
                
                    if (!color) {
                        $patchStyleText(selection, { 'color': null });
                    } else {
                            $patchStyleText(selection, { 'color': color });
                        }
                        
                    }
                    return true;
                },
                0
            );
    }, [editor]);
    let handleSetColor = (color) => {
        setTextColor(color)
        setPrevColor(color)
          if (textColor) {
            editor.dispatchCommand(APPLY_TEXTCOLOR_COMMAND, { color });

        } else {
            editor.dispatchCommand(APPLY_TEXTCOLOR_COMMAND, { color: null });
        }
    }
    
    return (
        <Popover  >
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={`border-none gap-2.5  `} >

                    {itemIcon}
                    {
                        textColor &&
                        <div className="w-[10px] rounded-full h-2 " style={{ backgroundColor: textColor }}>

                        </div>
                    }

                </Button>
            </PopoverTrigger>

            <PopoverContent className={" p-3.5 flex flex-col gap-3"}>
                <PopoverClose>
                </PopoverClose>
                <div className="grid grid-cols-7 gap-y-1 w-full">
                    {highlightColors.map((color, idx) => {
                        return <PopoverClose key={idx} >
                            <div onClick={() => handleSetColor(color)} className={`size-7 flex items-center ${textColor === color ? "" : ""} justify-center rounded-full`} style={{ background: color }} >
                                {textColor === color &&
                                    <Check size={17} style={{ color: getCheckColor(color) }} />
                                }
                            </div>
                        </PopoverClose>
                    })}
                </div>
                <div className="flex gap-1.5">

                    <PopoverClose>
                        <div onClick={() => setOpenChromePicker(true)} className="py-2 px-2 hover:bg-gray-9  bg-gray-8 cursor-pointer rounded-lg flex gap-1.5 items-center">

                            <PlusCircle size={15} />
                            <p className="text-[0.9rem]  text-gray-2">Custom</p>
                        </div>
                    </PopoverClose>
                    <div onClick={handleOpenPicker} className="py-2 px-2 hover:bg-gray-9 bg-gray-8 cursor-pointer rounded-lg flex gap-1.5 items-center">

                        <Pipette size={15} />
                        <p className="text-[0.9rem]  text-gray-2">Choose </p>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    {TextCustomColors.map((color) => {
                        return <div key={color} onClick={() => handleSetColor(color)} className={`size-7 flex items-center ${textColor === color ? "" : ""} justify-center rounded-full`} style={{ background: color }} >
                            {textColor === color &&
                                <Check size={17} style={{ color: getCheckColor(color) }} />
                            }
                        </div>
                    })}

                </div>

            </PopoverContent>
        </Popover>
    )
}

export default memo(TextColorEditor)