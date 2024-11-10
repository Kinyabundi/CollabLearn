import Web3Btn from "@/components/btns/Web3Btn";
import { useWeb3Context } from "@/context/Web3Provider";
import AppLayoutWrapper from "@/layouts/AppLayoutWrapper";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const {
    state: { isAuthenticated },
  } = useWeb3Context();
  return (
    <AppLayoutWrapper>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <Web3Btn />
          {isAuthenticated && <Link to={"/app"} className="text-blue-600 hover:underline">Go To App</Link>}
        </div>
      </div>
    </AppLayoutWrapper>
  );
};

export default LandingPage;
