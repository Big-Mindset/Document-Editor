import { useRef } from "react"
import {create} from "zustand"

export let documentStore = create((set)=>({
    fontSize : 12,
    setFontSize :  (fontSize)=>set({fontSize}),
    openChromePicker : false,
    setOpenChromePicker : (openChromePicker)=>set({openChromePicker}),
    highlight : "",
    setHighLight : (highlight)=>set({highlight}),
    customColors : [],
    setCustomColors : (color)=>set((state)=>{
        if (state.customColors.includes(color)){
            return state.customColors
        }
        return {

            customColors : [...state.customColors,color]
        }
    }),
    setTextColor : (textColor)=>set({textColor}),
    textColor : "#FFFFFF",
    setTextCustomColors : (color)=>set((state)=>{
        if (state.customColors.includes(color)){
            return state.customColors
        }
        return {

            customColors : [...state.customColors,color]
        }
    }),
    TextCustomColors : [],
    prevColor : "",
    setPrevColor  : (prevColor)=>set({prevColor}),
    fontFamily : "Inter" , 
    setFontFamily : (fontFamily)=>set({fontFamily}),
    default_highlight : "",
    setdefault_highlight : (default_highlight)=>set({default_highlight})
}))