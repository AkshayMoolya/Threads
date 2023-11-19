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

  const notifications = await fetchLikeNotifications({ userId: userInfo.id });
  // console.log(notifications);

  return (
    <div className=" space-y-2 ">
      {notifications.length > 0
        ? notifications.map((notification) => (
            // console.log(notification)
            <Notification
              key={notification.id}
              currentUser={userInfo}
              data={notification}
            />
          ))
        : "No notifications"}
    </div>
  );
}

export default Page;
