import { CheckCheckIcon, ClipboardIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";

interface IProps {
  text: string;
  customToastText?: string;
  disabled?: boolean;
}

const CopyToClipboardBtn = ({
  text,
  disabled = false,
  customToastText = "Text copied to clipboard",
}: IProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast(customToastText);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <Button
      onClick={handleCopy}
      disabled={disabled}
      variant={"outline"}
      size={"icon"}
    >
      {isCopied ? <CheckCheckIcon /> : <ClipboardIcon />}
    </Button>
  );
};

export default CopyToClipboardBtn;
