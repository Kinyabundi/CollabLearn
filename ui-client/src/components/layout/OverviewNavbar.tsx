import { getSlicedAddress } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import CopyToClipboardBtn from "../btns/CopyToClipboardBtn";
import Web3Btn from "../btns/Web3Btn";
import { useWeb3Context } from "@/context/Web3Provider";
import { useNavigate } from "react-router-dom";

const OverviewNavbar = () => {
  const navigate = useNavigate();
  const handleAddProject = () => {
    navigate("/app/create-new-project"); 
  };
  const {
    state: { isAuthenticated, address },
  } = useWeb3Context();
  return (
    <div className="flex items-center justify-between px-5 md:px-10 py-4 border-b bg-gray-100">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src="https://api.dicebear.com/9.x/shapes/svg?seed=Riley"
            alt="@riley"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {isAuthenticated && (
          <>
            <p className="text-sm">{getSlicedAddress(address!)}</p>
            <CopyToClipboardBtn
              text={address!}
              customToastText="Wallet Address Copied to clipboard"
            />
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleAddProject}>
          <PlusIcon /> Add Project
        </Button>
        <Avatar className="border">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
              address ? "shadcn" : "Vivian"
            }`}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Web3Btn />
      </div>
    </div>
  );
};

export default OverviewNavbar;
