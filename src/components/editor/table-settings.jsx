
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {INSERT_TABLE_COMMAND  } from "@lexical/table";
export default function TableSettings({item}) {
    let [tableValues,settableValues] = useState({
        rows : 1,
        columns : 1
    })
    let [editor] = useLexicalComposerContext()
    let handleCreateTable = ()=>{
        editor.dispatchCommand(INSERT_TABLE_COMMAND,tableValues)
        
    }
    return (
        <Dialog>
            <DialogTrigger asChild>

        <Button key={item.id} variant="outline" className={`border-none `} >

            {item.icon}
        </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-center"}>
                        Add Table
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                <Label htmlFor="rows">
                    Rows
                </Label>
                <Input type="number" max={30} min={1} onChange={(e)=>{
                    let value = Number(e.target.value)
                    console.log(value);
                    
                    if (value > 30) value= 30
                    if (value < 1) value = 1
                    settableValues(prev=>({...prev,rows : value}))
                }} value={tableValues["rows"]} id="rows" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="columns">
                    Columns
                </Label>
                <Input  type="number"  max={30} min={1} onChange={(e)=>{
                    let value = Number(e.target.value)
                    if (value > 30) value= 30
                    if (value < 1) value = 1
                    settableValues(prev=>({...prev,columns : value}))
                }} value={tableValues["columns"]} id="columns" />
                </div>
            <DialogClose asChild >


                <Button  onClick={handleCreateTable}>
                    Create
                </Button>
            </DialogClose>
            </DialogContent>
        </Dialog>
    )
}