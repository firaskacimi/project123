"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/state/store";
import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryProvider>
        <Toaster position="top-center" />
        {children}
      </QueryProvider>
    </Provider>
  );
}
