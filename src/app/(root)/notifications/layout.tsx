import NotificationsNav from "@/components/shared/NotificationsNav";
import { buttonVariants } from "@/components/ui/button";

import React from "react";

function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-0">
      <NotificationsNav />
      {children}
    </div>
  );
}

export default NotificationsLayout;
