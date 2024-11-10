import { FC, ReactNode } from "react";
import RootLayout from "./RootLayout";
import Web3ContextProvider from "@/context/Web3Provider";

interface IProps {
  children: ReactNode;
}

const AppLayoutWrapper: FC<IProps> = ({ children }) => {
  return (
    <Web3ContextProvider>
      <RootLayout>{children}</RootLayout>
    </Web3ContextProvider>
  );
};

export default AppLayoutWrapper;
