import { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const RootLayout: FC<IProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white antialiased transition-colors duration-200 ease-in-out">
      {children}
    </div>
  );
};

export default RootLayout;
