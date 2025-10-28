import { $patchStyleText } from '@lexical/selection';

import { highlightColors } from "@/utils/toolbarObj"
import { PopoverClose } from "@radix-ui/react-popover"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Check, Pipette, PlusCircle } from "lucide-react"
import { documentStore } from "@/lib/store/documentStore"
import { memo, useEffect, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { createCommand, $getSelection, $isRangeSelection } from "lexical";

const APPLY_HIGHLIGHT_COMMAND = createCommand("APPLY_HIGHLIGHT_COMMAND");

 function HighLightColorsSelector({ itemIcon }) {
    let { setOpenChromePicker, setHighLight, highlight, customColors, setCustomColors,setdefault_highlight } = documentStore()
    let handleSetColor = (color) => {
        setHighLight(color)
    }
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
        setCustomColors(selectedColor)
        setHighLight(selectedColor)
    }


    useEffect(() => {

        return editor.registerCommand(
            APPLY_HIGHLIGHT_COMMAND,
            (payload) => {
                const { color } = payload;
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                
                        if (!color) {
                            $patchStyleText(selection, { 'background-color': null });
                        } else {
                            $patchStyleText(selection, { 'background-color': color });
                        }

                }
                return true;
            },
            0
        );
    }, [editor]);

    useEffect(() => {
        if (highlight) {
            editor.dispatchCommand(APPLY_HIGHLIGHT_COMMAND, { color: highlight });

        } else {
            editor.dispatchCommand(APPLY_HIGHLIGHT_COMMAND, { color: null });
        }
    }, [highlight]);

    let handleChangeToDefault = () => {
        setHighLight(null)
        setdefault_highlight(true)
        editor.update(()=>{

            let selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { 'background-color': null });
            }
        })
    }
    
    return (
        <Popover  >
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={`border-none gap-2.5  `} >

                    {itemIcon}
                    {
                        highlight &&
                        <div className="w-[10px] rounded-full h-2 " style={{ backgroundColor: highlight }}>

                        </div>
                    }

                </Button>
            </PopoverTrigger>

            <PopoverContent className={" p-3.5 flex flex-col gap-3"}>
                <PopoverClose>

                    <div onClick={() => handleChangeToDefault()} className="py-2 px-4 hover:bg-gray-9 rounded-lg flex gap-1.5 items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z" />
                            <line x1="4" y1="20" x2="20" y2="4" />
                        </svg>
                        <p className="text-[0.9rem]  text-gray-2">None</p>
                    </div>
                </PopoverClose>
                <div className="grid grid-cols-7 gap-y-1 w-full">
                    {highlightColors.map((color, idx) => {
                        return <PopoverClose key={idx} >
                            <div onClick={() => handleSetColor(color)} className={`size-7 flex items-center ${highlight === color ? "" : ""} justify-center rounded-full`} style={{ background: color }} >
                                {highlight === color &&
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
                    {customColors.map((color) => {
                        return <div key={color} onClick={() => handleSetColor(color)} className={`size-7 flex items-center ${highlight === color ? "" : ""} justify-center rounded-full`} style={{ background: color }} >
                            {highlight === color &&
                                <Check size={17} style={{ color: getCheckColor(color) }} />
                            }
                        </div>
                    })}

                </div>

            </PopoverContent>
        </Popover>
    )
}

export default memo(HighLightColorsSelector)