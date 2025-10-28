
import { useInboxNotifications } from "@liveblocks/react";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Bell } from "lucide-react";

export function NotificationInbox() {
    const { inboxNotifications } = useInboxNotifications();
    console.log(inboxNotifications);
    
    return (
        <div className="absolute top-12 right-30 overflow-auto max-w-[400px]"> 

            <InboxNotificationList>
                {inboxNotifications?.length > 0 ? inboxNotifications.map((notification) => (
                    <InboxNotification
                        key={notification.id}
                        inboxNotification={notification}
                    />
                ))
            : <div className="bg-gray-10 p-2 w-full rounded-lg">
                <span>Notifications not found</span>
            </div>
            }
            </InboxNotificationList>
        </div>


    );
}