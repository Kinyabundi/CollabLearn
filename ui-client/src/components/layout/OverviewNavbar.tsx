import { getSlicedAddress } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import CopyToClipboardBtn from "../btns/CopyToClipboardBtn";
import Web3Btn from "../btns/Web3Btn";

const OverviewNavbar = () => {
  return (
    <div className="flex items-center justify-between px-5 md:px-10 py-4 border-b bg-gray-100">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://api.dicebear.com/9.x/shapes/svg?seed=Riley" alt="@riley" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-sm">
          {getSlicedAddress("0x41a9dc633faFd6cfA50107eD7040a1c39b5e1319")}
        </p>
        <CopyToClipboardBtn
          text="0x41a9dc633faFd6cfA50107eD7040a1c39b5e1319"
          customToastText="Wallet Address Copied to clipboard"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button>
          <PlusIcon /> Add Project
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Web3Btn />
      </div>
    </div>
  );
};

export default OverviewNavbar;
