import { Outlet } from "react-router-dom";
import AppLayoutWrapper from "./AppLayoutWrapper";
import OverviewNavbar from "@/components/layout/OverviewNavbar";

const OverviewLayout = () => {
  return (
    <AppLayoutWrapper>
      <div className="flex flex-col flex-1 transition-all">
        <OverviewNavbar />
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-1 flex-col px-2 md:px-[30px] py-5 overflow-y-auto h-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
};

export default OverviewLayout;
