"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/state/store";
import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname } from "next/navigation";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavFooter = pathname === "/login" || pathname === "/register";

  return (
    <Provider store={store}>
      <QueryProvider>
        <Toaster position="top-center" />
        <LoadingSpinner>
          <div className="min-h-screen bg-[#030712] flex flex-col">
            {!hideNavFooter && <Navbar />}
            <main className="flex-1 bg-[#030712] px-4 sm:px-6 lg:px-8 py-12">
              {children}
            </main>
            {!hideNavFooter && <Footer />}
          </div>
        </LoadingSpinner>
      </QueryProvider>
    </Provider>
  );
}
