import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/common";
import { classNames } from "@/utils";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const titleGradient = {
  background:
    "linear-gradient(270deg, #ff7e5f, #feb47b, #ff7e5f)",
  backgroundSize: "200% 200%",
  animation: "gradientAnimation 5s ease infinite",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  MozBackgroundClip: "text",
  MozTextFillColor: "transparent",
};

const gradientAnimation = `
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: (page: string) => void;
}

export function MobileSidebar({ sidebarOpen, setSidebarOpen, setCurrentPage }: MobileSidebarProps) {
  const pathName = usePathname();

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = gradientAnimation;
    document.head.appendChild(styleElement);
  }, []);

  const sections = [
    { name: "home", label: "Home" },
    { name: "services", label: "Services" },
    { name: "studio", label: "Studio" },
    { name: "history", label: "History" },
    { name: "about", label: "About" },
  ];

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 text-white lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu size={30} />
      </button>
      <aside
        className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex grow flex-col gap-y-8 overflow-y-auto rounded-xl bg-white/10 p-6 shadow-xl backdrop-blur-lg">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <button
              className="bg-clip-text text-3xl font-bold text-transparent"
              style={titleGradient}
              onClick={() => {
                setCurrentPage("home");
                setSidebarOpen(false);
              }}
            >
              ZDesigner AI
            </button>
            <button
              className="text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={30} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-6">
              {sections.map((section) => (
                <li key={section.name}>
                  <ul role="list" className="mt-2 space-y-2">
                    {(navigation[section.name] || []).map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            pathName === item.href
                              ? "scale-105 transform bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-black shadow-lg"
                              : "text-gray-300 shadow-md hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-black hover:shadow-lg",
                            "group flex gap-x-4 rounded-lg p-4 text-base font-semibold transition-all duration-300 ease-in-out"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon
                            className={classNames(
                              pathName === item.href
                                ? "text-black"
                                : "text-gray-300 group-hover:text-black",
                              "h-6 w-6 shrink-0 transition-all duration-300 ease-in-out"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}