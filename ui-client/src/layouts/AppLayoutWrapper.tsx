import { FC, ReactNode } from "react";
import RootLayout from "./RootLayout";

interface IProps {
  children: ReactNode;
}

const AppLayoutWrapper: FC<IProps> = ({ children }) => {
  return (
      <RootLayout>{children}</RootLayout>
  );
};

export default AppLayoutWrapper;
