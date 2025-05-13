"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import BookLoader from "@/components/book-loader";
import { Toaster } from "react-hot-toast";
import AuthCheck from "@/store/provider/auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<BookLoader />} persistor={persistor}>
        <Toaster />
        <AuthCheck>{children}</AuthCheck>
      </PersistGate>
    </Provider>
  );
}
