import ThemeChange from "@/components/controls/ThemeChanger";
import React from "react";

function SettingsPage() {
  return (
    <div className="p-4 sm:p-0">
      <h1 className="text-heading3-bold  sm:mt-9">Settings</h1>
      <ThemeChange />
    </div>
  );
}

export default SettingsPage;
