"use client";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolBarPlugin from "./ToolBarPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { onChangeHandler } from "./EditorControl";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import FloatingToolbar from "./plugins/FloatingToolbar";
import {
    FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useIsEditorReady
} from "@liveblocks/react-lexical";
import Loader from "../Loader";
import { useThreads } from "@liveblocks/react";
import Comments from "./Comments";

export default function Editor({ currentUser,users }) {
    let status = useIsEditorReady()
    let {threads} = useThreads()
    console.log(threads);
    
  const initialConfig = liveblocksConfig({
    namespace: "Docs",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline underline-offset-2",
        strikethrough: "line-through",
        code: "font-mono bg-gray-100 rounded px-1 text-red-600",
      },
      heading: {
        h1: "text-4xl",
        h2: "text-3xl",
        h3: "text-2xl",
      },
    },
    editable: currentUser === "editor",
    onError(error) {
      console.error(error);
    },
    nodes: [HeadingNode, CodeNode, ListNode, ListItemNode, TableNode, TableRowNode, TableCellNode],
  });

  return (
    <div className="size-full relative">
      <div className="relative size-full  flex justify-center gap-3.5 mt-40 b-20 overflow-y-auto  pb-52  ">
     
           <LexicalComposer initialConfig={initialConfig}>
          <ToolBarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className=" h-[1300px] w-[900px] editor border border-gray-8 bg-gray-10 rounded-md p-10  outline-none"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          {currentUser === "editor" && <FloatingToolbar />}
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChangeHandler} />
          <ListPlugin />
          <CheckListPlugin />
          <TablePlugin />
          
          <LiveblocksPlugin   >
            <FloatingComposer  className="floating-composer" />
            <FloatingThreads  className="floating-threads" threads={threads} />
            <div className="h-[890px] sticky  top-0 overflow-y-auto">

         <Comments  />
            </div>
          </LiveblocksPlugin>
          
        </LexicalComposer> 
            
       
      
      </div>
    </div>
  );
}
