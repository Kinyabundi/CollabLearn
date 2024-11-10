import CopyToClipboardBtn from "@/components/btns/CopyToClipboardBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSlicedAddress } from "@/utils";
import { AlbumIcon, BookOpen, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

const OverviewScreen = () => {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          <BookOpen className="w-5 h-5" />{" "}
          <span className="ml-2">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="repos">
          <AlbumIcon className="w-5 h-5" />{" "}
          <span className="ml-2">Projects</span>
        </TabsTrigger>
        <TabsTrigger value="stars">
          <StarIcon className="w-5 h-5" /> <span className="ml-2">Stars</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="px-[100px]">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="repos">Projects</TabsContent>
      <TabsContent value="stars">Stars</TabsContent>
    </Tabs>
  );
};

const OverviewTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-5 mt-5">
      <div className="col-span-3">
        <Avatar className="w-80 h-80">
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="mt-5"></div>
        <h3 className="font-bold">Wallet Address</h3>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm">
            {getSlicedAddress("0x41a9dc633faFd6cfA50107eD7040a1c39b5e1319")}
          </p>
          <CopyToClipboardBtn
            text="0x41a9dc633faFd6cfA50107eD7040a1c39b5e1319"
            customToastText="Wallet Address Copied to clipboard"
          />
        </div>
        <div className="mt-5"></div>
        <h3 className="font-bold">Achievements</h3>
        <div className="flex mt-2 items-center gap-2">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="col-span-7">
        <h1>Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {[...Array.from({ length: 6 })].map((_, idx) => (
            <RepoCardItem key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RepoCardItem = () => {
  return (
    <div className="px-3 py-3 rounded-xl border border-gray-300">
      <div className="h-[120px] flex flex-col justify-between">
        <div className="">
          <div className="flex items-center gap-3">
            <AlbumIcon className="w-5 h-5" />
            <span>
              <Link
                to={"/app"}
                className="hover:underline text-blue-500 font-semibold"
              >
                AI Research Paper
              </Link>
            </span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              dolor.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Medicine</Badge>
          <Button variant={"ghost"} size={"icon"}>
            <StarIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverviewScreen;
