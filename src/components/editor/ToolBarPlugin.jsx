

import { fontSizes, lexicalToolbarItems, textSizes } from "@/utils/toolbarObj";
import { Button } from "../ui/button";
import { ChevronDown, Heading } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $createParagraphNode, $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, COMMAND_PRIORITY_EDITOR, createCommand, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, TEXT_TYPE_TO_FORMAT, UNDO_COMMAND } from "lexical";
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import { documentStore } from "@/lib/store/documentStore";
import ColorMaker from "./ColorMaker";
import { AnimatePresence } from "framer-motion";
import HighLightColorsSelector from "./highlight-colors-slector";
import TextColorEditor from "./text-color-change";
import Fonts from "./Fonts";
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND } from "@lexical/list"
import TableSettings from "./table-settings";

const FORMAT_HEADING_COMMAND = createCommand("FORMAT_HEADING_COMMAND")
export default function ToolBarPlugin() {
    const { openChromePicker, setTextColor, prevColor, setHighLight, default_highlight, setdefault_highlight } = documentStore()
    const [formats, setFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,

    });
    const [focus, setFocus] = useState(false)
    let { fontSize, setFontSize } = documentStore()
    const [textStyle, setTextStyle] = useState("Normal text")
    const [open, setOpen] = useState(false)
    let [editor] = useLexicalComposerContext()
    let timeInputRef = useRef()
    let prevInput = useRef(0)
    const [listType , setListType] = useState("")
    const [history, setHistory] = useState({
        undo: false,
        redo: false
    })
    useEffect(() => {
        let handleChangeFont = (e) => {
            if (focus) {
                setFontSize(fontSize)
            }


        }
        window.addEventListener("mousedown", handleChangeFont)
        return () => {
            window.removeEventListener("mousedown", handleChangeFont)

        }
    }, [focus])

    useEffect(() => {
        let handleChangeFont = (e) => {
            if (e.key === "Enter" && fontSize !== prevInput.current) {
                e.preventDefault()
                editor.update(() => {
                    let selection = $getSelection()
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, { "font-size": `${fontSize}pt` })

                    }
                })
            }

        }
        window.addEventListener("keydown", handleChangeFont)
        return () => {
            window.removeEventListener("keydown", handleChangeFont)

        }
    }, [fontSize])



    let handleChangeFontSize = (size) => {
        setFontSize(size)
        setOpen(false)

        editor.update(() => {
            let selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-size": `${size}pt` })


            }

        })

        editor.blur();
        setTimeout(() => {
            editor.focus();
        }, 0);

    }




    useEffect(() => {

        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        let anchor = selection.anchor.getNode()
                        let headingnode = $getNearestNodeOfType(anchor, HeadingNode)
                        let text_style = headingnode?.getTag()

                        const color = $getSelectionStyleValueForProperty(selection, 'color', '');
                        const bgColor = $getSelectionStyleValueForProperty(selection, 'background-color', '');
                        setFormats({
                            bold: selection.hasFormat("bold"),
                            italic: selection.hasFormat("italic"),
                            underline: selection.hasFormat("underline"),
                            strikethrough: selection.hasFormat("strikethrough")
                        });
                        if (text_style) {
                            setTextStyle(text_style)
                        } else {
                            setTextStyle("Normal text")

                        }
                        if (bgColor) {
                            if (!default_highlight) {

                                setHighLight(bgColor)
                            } else {
                                setdefault_highlight(false)
                            }
                        }

                        if (color) {

                            setTextColor(color)
                        } else {
                            if (prevColor) {

                                setTextColor(prevColor)
                            }
                        }

                    }
                });
            }),

            editor.registerCommand(
                FORMAT_HEADING_COMMAND,
                (blockType) => {

                    editor.update(() => {
                        const selection = $getSelection();

                        if ($isRangeSelection(selection)) {
                            if (blockType === 'paragraph') {
                                $setBlocksType(selection, () => $createParagraphNode());
                            } else if (blockType === 'h1' || blockType === 'h2' || blockType === 'h3') {

                                $setBlocksType(selection, () => $createHeadingNode(blockType));
                            } else if (blockType === "title") {

                                // $patchStyleText(selection, { 'font-size': "26pt" ,"font-weight" : "medium"  });

                            }
                        }
                    });
                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setHistory(prev => ({ ...prev, undo: payload }));
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            ),

            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setHistory(prev => ({ ...prev, redo: payload }));

                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            )

        )

    }, [editor]);



    const handleChangeTextStyle = (name, value) => {

        setTextStyle(name);
        editor.dispatchCommand(FORMAT_HEADING_COMMAND, value);
    };

    let handleTextFormate = (formatID, formatType) => {
        if (formatType === "text-format") {

            editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatID)
        } else if (formatType === "alignment") {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, formatID)
        } else if (formatType === "history") {
            if (formatID === "undo") {

                editor.dispatchCommand(UNDO_COMMAND, undefined)

            } else {
                editor.dispatchCommand(REDO_COMMAND, undefined)

            }
        } else if (formatType === "list") {
            editor.update(() => {
        const selection = $getSelection();
        
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            
            const listNode = $getNearestNodeOfType(anchorNode, ListNode);
       
            const isUnordered = formatID === "unordered-list" ? "unorder" : formatID === "check" ? "check" : "ordered";
            const targetType = isUnordered === "unorder" ? "bullet" : isUnordered === "ordered"  ? 'number' : 'check';
           
            if (listNode) {
                const currentType = listNode.getListType();
                if (currentType === targetType) {
                    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                setListType("")

                    return;
                }
            }
            
            setListType(formatID)
            editor.dispatchCommand(
                isUnordered === "unorder" ? INSERT_UNORDERED_LIST_COMMAND : isUnordered === "ordered"  ? INSERT_ORDERED_LIST_COMMAND : INSERT_CHECK_LIST_COMMAND,
                
                undefined
            );
        }
    });
                
        }
    }
    console.log(listType);
    
    return (
        <>
            <div className="fixed bg-gray-11 top-14 h-20  p-2  flex justify-center items-end w-full">
                <div className="flex items-center gap-4 justify-center">
                    {lexicalToolbarItems.map((item) => {
                        const Divider = <span key={item.id} style={{ display: "inline-block", width: 1, height: 30, background: "white", opacity: 0.25 }} />
                        if (item.type === "divider") {
                            return Divider
                        } else if (item.id === "heading") {
                            return <Popover key={item.id}>
                                <PopoverTrigger asChild>

                                    <div className="rounded-lg hover:bg-gray-7 bg-gray-9 flex items-center gap-1 px-2 py-1.5 cursor-pointer text-[0.9rem]">
                                        <span>{textStyle}</span> <span><ChevronDown size={14} /></span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className={"w-[250px] p-0 flex gap-3.5 flex-col"}>
                                    {textSizes.map((text) => {
                                        return <div onClick={() => handleChangeTextStyle(text.name, text.id)} key={text.name} className={`p-2 hover:bg-gray-10 cursor-pointer ${text.textSize} ${text.textWeight}`}>
                                            {text.name}
                                        </div>
                                    })}


                                </PopoverContent>
                            </Popover>
                        } else if (item.id === "fonts") {
                            return <Fonts key={item.id} item={item} />
                        } else if (item.id === "font-size") {
                            return <Popover key={item.id} open={open} onOpenChange={(e) => setOpen(e)}>
                                <PopoverTrigger asChild>
                                    <input
                                        ref={timeInputRef}
                                        type="number"
                                        onFocus={() => setFocus(true)}
                                        onBlur={() => setFocus(false)}
                                        min="1"
                                        value={fontSize}
                                        onChange={(e) => {
                                            prevInput.current = fontSize
                                            setFontSize(e.target.value)
                                        }}
                                        className="w-8  px-1 py-0.5 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </PopoverTrigger>

                                <PopoverContent className={"w-[200px] p-0 flex  flex-col"}>
                                    {fontSizes.map((size) => {

                                        if (size === fontSize) {

                                            return <div key={size} className=" flex justify-between items-center  py-1 px-4 font-[0.7rem] bg-gray-9 cursor-pointer">
                                                {size}
                                            </div>
                                        }
                                        return <div key={size} onClick={() => handleChangeFontSize(size)} className=" py-1 px-4 font-[0.7rem] hover:bg-gray-10 cursor-pointer">
                                            {size}
                                        </div>

                                    })}

                                </PopoverContent>
                            </Popover>

                        } else if (item.id === "highlight") {

                            return <HighLightColorsSelector key={item.id} itemIcon={item.icon} />
                        } else if (item.id === "text-color") {
                            return <TextColorEditor key={item.id} itemIcon={item.icon} />
                        } else if (item.type === "history") {
                            return <Button disabled={!history[item.id]} onClick={() => handleTextFormate(item.id, item.type)} key={item.id} variant={formats?.[item.id] ? "default" : "outline"} className={`border-none ${formats?.[item.id] && "bg-blue-900 text-white hover:bg-blue-900"}`} >

                                {item.icon}
                            </Button>
                        }else if (item.id === "table"){
                           return  <TableSettings key={item.id} item={item} />
                        }

                        return <Button  onClick={() => handleTextFormate(item.id, item.type)} key={item.id} variant={(formats?.[item.id] || listType === item.id) ? "default" : "outline"} className={`border-none ${listType === item.id && "bg-blue-900 text-white hover:bg-blue-900"} ${formats?.[item.id] && "bg-blue-900 text-white hover:bg-blue-900"}`} >

                            {item.icon}
                        </Button>
                    })}

                </div>

            </div>
            <AnimatePresence>

                {openChromePicker &&
                    <ColorMaker />
                }
            </AnimatePresence>
        </>
    )
}