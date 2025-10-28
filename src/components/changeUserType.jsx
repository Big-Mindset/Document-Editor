"use client"
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useLoading } from "@/utils/LoadingContext";
import { updateUserAccess } from "@/lib/actions/create-room";
import { roomStore } from "@/lib/store/roomStore";
import { Loader2 } from "lucide-react";

export default function ChangeAccess({ email, access }) {
    // Normalize the access value
    const normalizeAccess = (val) => {
        if (val === "editor") return "editor";
        return "viewer";
    };

    const [userType, setUserType] = useState(normalizeAccess(access));
    const {loading, setLoading} = useLoading();
    const roomId = roomStore((s) => s.roomId);
    
    const handleChange = async (value) => {
        const newType = value === "can edit" ? "editor" : "viewer";
        
        if (newType === userType) return;

        setLoading("access-change");
        
        try {
            await updateUserAccess({
                access: newType === "editor" ? "edit" : "view",
                email,
                roomId
            });
            setUserType(newType);
        } catch (error) {
            console.error("Failed to update user access:", error);
        } finally {
            setIsUpdating(null

            );
        }
    };

    return (
        <Select 
            value={userType === "editor" ? "can edit" : "can view"}
            onValueChange={handleChange}
            disabled={loading === "access-change"}
        >
            <SelectTrigger className="min-w-[100px]">
                {loading === "access-change"  ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                    </div>
                ) : (
                    <SelectValue />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>User Control</SelectLabel>
                    <SelectItem value="can edit">Can edit</SelectItem>
                    <SelectItem value="can view">Can view</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}