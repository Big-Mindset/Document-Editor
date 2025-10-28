
import {  lexicalFontOptions } from "@/utils/toolbarObj";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { $getSelection, $isRangeSelection, createCommand } from "lexical";
import { memo, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDown } from "lucide-react";
import { documentStore } from "@/lib/store/documentStore";


const APPlY_FONTFAMILY_COMMAND = createCommand("APPlY_FONTFAMILY_COMMAND")
function Fonts({item}) {
    let [editor] = useLexicalComposerContext()
        const {fontFamily , setFontFamily} = documentStore()
        const [fontPopoverOpen , setfontPopoverOpen] = useState(false)

            useEffect(() => {
              
                return editor.registerCommand(
                    APPlY_FONTFAMILY_COMMAND,
                    ({FontFamily}) => {
                    
                        const selection = $getSelection();
                        editor.update(()=>{
        
                            if ($isRangeSelection(selection)) {
                                
                                if (!FontFamily) {
                                    $patchStyleText(selection, { 'font-family': null });
                                } else {
                                    
                                    $patchStyleText(selection, { 'font-family': FontFamily });
                                }
                                
                            }
                        })
                        return true;
                    },
                    0
                );
            }, [editor]);

      let handleChangeFont = (fontLabel , font_Family)=>{
        setfontPopoverOpen(false)
  
        setFontFamily(fontLabel)
        editor.dispatchCommand(APPlY_FONTFAMILY_COMMAND,{FontFamily : font_Family})
    }
   return  <Popover open={fontPopoverOpen} onOpenChange={(e) => setfontPopoverOpen(e)} key={item.id}>
        <PopoverTrigger asChild>

            <div className="rounded-lg hover:bg-gray-7 bg-gray-9 flex items-center gap-1 px-2 py-1.5 cursor-pointer text-[0.9rem]">
                <span>{fontFamily}</span> <span><ChevronDown size={14} /></span>
            </div>
        </PopoverTrigger>
        <PopoverContent className={"w-[200px] p-0 flex  flex-col"}>
            {lexicalFontOptions.map((font) => {

                if (font.label === fontFamily) {

                    return <div key={item.id} className=" flex justify-between items-center  py-1 px-4 font-[0.7rem] bg-gray-9 cursor-pointer">
                        {font.label}
                    </div>
                }
                return <div key={font.id} onClick={() => handleChangeFont(font.label, font.fontFamily,)} className=" py-1 px-4 font-[0.7rem] hover:bg-gray-10 cursor-pointer">
                    {font.label}
                </div>
            })}

        </PopoverContent>
    </Popover>
}

export default memo(Fonts)