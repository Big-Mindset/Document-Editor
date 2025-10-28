"use client"

import { useRoom, useOthers, useSelf, useStatus } from "@liveblocks/react/suspense";
import { useCollaborationContext } from "@liveblocks/react-lexical";

// ✅ Component 1: Check Room Connection (Place inside RoomProvider)
export function RoomDebug() {
    const room = useRoom();
    const others = useOthers();
    const self = useSelf();
    const status = useStatus();

    return (
        <div className="fixed top-0 right-0 bg-black/80 text-white p-4 rounded-bl-lg z-50 text-xs">
            <h3 className="font-bold mb-2">🔍 Room Debug</h3>
            <div className="space-y-1">
                <p>✅ Room ID: {room.id}</p>
                <p>✅ Status: {status}</p>
                <p>✅ Self ID: {self?.id || "Loading..."}</p>
                <p>✅ Others Count: {others.length}</p>
                <p>✅ Total Users: {others.length + 1}</p>
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto">
                <p className="font-semibold">Others:</p>
                {others.map((other) => (
                    <p key={other.connectionId}>
                        - {other.info?.name || "Anonymous"} ({other.connectionId})
                    </p>
                ))}
            </div>
        </div>
    );
}
