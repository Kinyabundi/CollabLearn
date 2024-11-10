import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { CirclePlusIcon, ZapIcon } from "lucide-react";
import { useWeb3Context } from "@/context/Web3Provider";
import { getSlicedAddress } from "@/utils";

// const iconClasses =
//   "text-xl text-default-500 pointer-events-none flex-shrink-0";

const Web3Btn = () => {
  const {
    connectWallet,
    disconnectWallet,
    state: { isAuthenticated, address },
  } = useWeb3Context();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          {isAuthenticated ? (
            <ZapIcon className="w-4 h-4" />
          ) : (
            <CirclePlusIcon className="w-4 h-4" />
          )}
          {isAuthenticated ? getSlicedAddress(address!) : "Connect"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={isAuthenticated ? disconnectWallet : connectWallet}
        >
          <span>{isAuthenticated ? "Disconnect" : "Click to connect"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Web3Btn;
