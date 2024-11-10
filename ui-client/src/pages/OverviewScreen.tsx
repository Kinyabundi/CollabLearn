import { ABI } from "@/abi/projectABI";
import CopyToClipboardBtn from "@/components/btns/CopyToClipboardBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeb3Context } from "@/context/Web3Provider";
import { getSlicedAddress } from "@/utils";
import { ethers } from "ethers";
import { AlbumIcon, BookOpen, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const OverviewScreen = () => {
  const { state } = useWeb3Context();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get the network
      const network = await provider.getNetwork();
      console.log('Current Network:', network);

      const contractAddress = "0xBe4A130015b50e2ea3Db14ED0516319B9fEac829";
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      try {

        const project = await contract.getResearchesByOwner(state.address);
        console.log("here is projects", project)
        setProjects(project)
        console.log(projects)
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);
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
      <TabsContent value="repos" className="px-[100px]">
        <ProjectsTab />
      </TabsContent>
      <TabsContent value="stars">Stars</TabsContent>
    </Tabs>
  );
};

const OverviewTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-5 mt-5">
      <div className="col-span-3">
        <SidebarContent />
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

const ProjectsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-5 mt-5">
      <div className="col-span-3">
        <SidebarContent />
      </div>
      <div className="col-span-7">
        <div className="">
          <input
            className="px-2 py-1.5 outline-none border-2 border-gray-500 rounded-xl w-full focus:border-blue-700"
            placeholder="Find project"
          />
        </div>
        <div className="mt-5 space-y-4">
          {[...Array.from({ length: 6 })].map((_, idx) => (
            <ProjectItem key={idx} />
          ))}
          <ProjectItem />
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
                to={`/app/view-project/ai-research-paper`}
                className="hover:underline text-blue-500 font-semibold"
              >
                AI Research
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

const ProjectItem = () => {
  return (
    <div className="py-6 border-y border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/app/view-project/premium-converts`}>
            <h3 className="text-blue-600 font-semibold hover:underline">premium-converts</h3>
          </Link>
          <Badge variant={"outline"}>Public</Badge>
        </div>
        <Button variant={"outline"} size={"sm"}>
          <StarIcon className="w-4 h-4" />
          Star
        </Button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Badge>Medicine</Badge>
        <Badge>Agriculture</Badge>·
        <div className="">
          <p className="text-sm">Updated 4 days ago</p>
        </div>
      </div>
    </div>
  );
};

const SidebarContent = () => {
  const {
    state: { isAuthenticated, address },
  } = useWeb3Context();
  return (
    <>
      <Avatar className="w-80 h-80 border">
        <AvatarImage
          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${address ? "shadcn" : "Vivian"
            }`}
          alt="shadcn"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="mt-5"></div>
      <h3 className="font-bold">Wallet Address</h3>
      <div className="flex items-center gap-2 mt-2">
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
    </>
  );
};

export default OverviewScreen;
