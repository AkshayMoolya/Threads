import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchLikeNotifications } from "@/lib/actions/notification.actions";
import Notification from "@/components/shared/Notification";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const notifications = await fetchLikeNotifications({ userId: userInfo._id });
  console.log(notifications);

  return (
    <div className=" space-y-2 ">
      {notifications.length > 0
        ? notifications.map((notification) => (
            // console.log(notification)
            <Notification
              user={user}
              senderImage={notification.userWhoTriggered.image}
              senderName={notification.userWhoTriggered.name}
              senderId={notification.userWhoTriggered.id}
              type={notification.type}
              threadId={notification.thread._id}
              _id={notification._id}
              createdAt={notification.createdAt}
              isRead={notification.isRead}
              isAdmin={notification.userWhoTriggered.isAdmin}
              senderUsername={notification.userWhoTriggered.username}
              threadText={notification.thread.content.text}
            />
          ))
        : "No notifications"}
    </div>
  );
}

export default Page;
