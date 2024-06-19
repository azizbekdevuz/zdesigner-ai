"use client";

import { useState } from "react";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";
import { DesktopSidebar } from "./desktop-sidebar";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>("home");

  return (
    <>
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setCurrentPage={setCurrentPage} // Add this line
      />
      <DesktopSidebar
        setCurrentPage={setCurrentPage} // Add this line
      />
      <Header onClick={() => setSidebarOpen(true)} />
    </>
  );
}