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

// Define the ResearchInfo type based on your contract
type ResearchInfo = {
  id: number;
  title: string;
  ipfsHash: string;
  owner: string;
  isActive: boolean;
  contributorCount: number;
  citationCount: number;
  requiredStake: bigint;
  currentVersion: number;
};

const OverviewScreen = () => {
  const { state } = useWeb3Context();
  const [projects, setProjects] = useState<ResearchInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!state.address) return;
      
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractAddress = "0xBe4A130015b50e2ea3Db14ED0516319B9fEac829";
        const contract = new ethers.Contract(contractAddress, ABI, signer);

        // Fetch projects by owner
        const ownerProjects = await contract.getResearchesByOwner(state.address);
        console.log("Owner projects:", ownerProjects);

        // Fetch all projects (if you want to show public projects)
        const allProjects = await contract.getAllResearches();
        console.log("All projects:", allProjects);

        // Convert to ResearchInfo array and set state
        const formattedProjects = ownerProjects.map((project: any) => ({
          id: Number(project.id),
          title: project.title,
          ipfsHash: project.ipfsHash,
          owner: project.owner,
          isActive: project.isActive,
          contributorCount: Number(project.contributorCount),
          citationCount: Number(project.citationCount),
          requiredStake: project.requiredStake,
          currentVersion: Number(project.currentVersion)
        }));

        setProjects(formattedProjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    const intervalId = setInterval(fetchProjects, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [state.address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
        <OverviewTab projects={projects} />
      </TabsContent>
      
      <TabsContent value="repos" className="px-[100px]">
        <ProjectsTab projects={projects} />
      </TabsContent>
      
      <TabsContent value="stars">Stars</TabsContent>
    </Tabs>
  );
};

const OverviewTab = ({ projects }: { projects: ResearchInfo[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-5 mt-5">
      <div className="col-span-3">
        <SidebarContent />
      </div>
      <div className="col-span-7">
        <h1 className="text-xl font-bold mb-4">Your Projects</h1>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <AlbumIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No projects yet</p>
            <Link 
              to="/app/create-new-project"
              className="mt-4 text-blue-600 hover:underline"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {projects.map((project) => (
              <RepoCardItem key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectsTab = ({ projects }: { projects: ResearchInfo[] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            {projects.length === 0 ? (
              <>
                <AlbumIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No projects yet</p>
                <Link 
                  to="/app/create-new-project"
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Create your first project
                </Link>
              </>
            ) : (
              <>
                <AlbumIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No projects match your search</p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredProjects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const RepoCardItem = ({ project }: { project: ResearchInfo }) => {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex justify-between">
        <Link 
          to={`/app/view-project/${project.id}`}
          className="font-medium hover:underline"
        >
          {project.title}
        </Link>
        <Badge variant={project.isActive ? "default" : "secondary"}>
          {project.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <a
        href={`https://gateway.pinata.cloud/ipfs/${project.ipfsHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline block mt-1"
      >
        View on IPFS
      </a>
    </div>
  );
};

const ProjectItem = ({ project }: { project: ResearchInfo }) => {
  return (
    <div className="py-6 border-y border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/app/view-project/${project.id}`}>
            <h3 className="text-blue-600 font-semibold hover:underline">
              {project.title}
            </h3>
          </Link>
          <Badge variant={"outline"}>
            {project.isActive ? "Public" : "Private"}
          </Badge>
        </div>
        <Button variant={"outline"} size={"sm"}>
          <StarIcon className="w-4 h-4" />
          Star
        </Button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Badge>Contributors: {project.contributorCount}</Badge>
        <Badge>Citations: {project.citationCount}</Badge>
        <div className="">
          <p className="text-sm">Version: {project.currentVersion}</p>
        </div>
      </div>
    </div>
  );
};

// Keep your existing SidebarContent component
const SidebarContent = () => {
  const {
    state: { isAuthenticated, address },
  } = useWeb3Context();
  return (
    <>
      <Avatar className="w-80 h-80 border">
        <AvatarImage
          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${address ? "shadcn" : "Vivian"}`}
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