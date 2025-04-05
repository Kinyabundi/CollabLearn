import { Toaster } from "@/components/ui/sonner";
import Web3ContextProvider from "@/context/Web3Provider";
import router from "@/router";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import LiveblockProvider from "./LiveblockProvider";

const AppProvider = () => {
  return (
    <HelmetProvider>
      <Web3ContextProvider>
        <LiveblockProvider>
          <RouterProvider router={router} />
        </LiveblockProvider>
      </Web3ContextProvider>
      <Toaster />
    </HelmetProvider>
  );
};

export default AppProvider;
