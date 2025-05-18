"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import KitabLoader from "@/components/kitab-loader";
import { Toaster } from "react-hot-toast";
import AuthCheck from "@/store/provider/auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<KitabLoader />} persistor={persistor}>
        <Toaster />
        <AuthCheck>{children}</AuthCheck>
      </PersistGate>
    </Provider>
  );
}
