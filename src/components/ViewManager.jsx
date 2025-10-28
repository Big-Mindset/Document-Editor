import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default function ViewManager({userType , setUserType}) {
    return (
        <Select defaultValue={userType === "edit" ? "can edit" : "can view"} >
            <SelectTrigger className="">
                <SelectValue className={"border-0 outline-0"} placeholder={userType} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>User Control</SelectLabel>
                    <SelectItem  onClick={()=>setUserType("edit")} value="can edit">can edit</SelectItem>
                    <SelectItem onClick={()=>setUserType("view")} value="can view">can view</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}