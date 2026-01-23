import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GridShape />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg rounded-2xl bg-white/50 px-6 py-10 backdrop-blur-md dark:bg-gray-900/50 sm:px-10 sm:py-14 border border-gray-200/50 dark:border-gray-700/50">
          {children}
        </div>
      </div>
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
