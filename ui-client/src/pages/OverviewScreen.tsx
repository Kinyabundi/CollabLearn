import { ABI } from "@/abi/projectABI";
import CopyToClipboardBtn from "@/components/btns/CopyToClipboardBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeb3Context } from "@/context/Web3Provider";
import { getSlicedAddress } from "@/utils";
import { getPinataUrl } from "@/utils/pinata";
import { ethers } from "ethers";
import { AlbumIcon, BookOpen, StarIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type ResearchInfo = {
  id: number;
  title: string;
  ipfsHash: string;
  description: string;
  owner: string;
  isActive: boolean;
  contributorCount: number;
  citationCount: number;
  requiredStake: string;
  currentVersion: number;
  areaOfStudy?: string;
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
        const contractAddress = "0x72d62F5849B6F22Fe4000478355270b8e776D6Db";
        const contract = new ethers.Contract(contractAddress, ABI, signer);

        // Fetch projects by owner
        const ownerProjects = await contract.getResearchesByOwner(state.address);
        console.log("Owner projects raw:", ownerProjects);

        // Convert to ResearchInfo array
        const formattedProjects = ownerProjects.map((project: any) => ({
          id: Number(project.id),
          title: project.title,
          ipfsHash: project.ipfsHash,
          description: project.describtion || "", // Note: Typo in contract?
          owner: project.owner,
          isActive: project.isActive,
          contributorCount: Number(project.contributorCount),
          citationCount: Number(project.citationCount),
          requiredStake: ethers.formatEther(project.requiredStake.toString()),
          currentVersion: Number(project.currentVersion)
        }));

        console.log("Formatted projects:", formattedProjects);
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
    const intervalId = setInterval(fetchProjects, 15000);
    
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
  const ipfsLink = getPinataUrl(project.ipfsHash);
  
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlbumIcon className="w-5 h-5 text-gray-600" />
            <Link 
              to={`/app/view-project/${project.id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {project.title}
            </Link>
            <Badge variant="outline" className="border-gray-300">
              {project.isActive ? 'Public' : 'Private'}
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-3">
            {project.description || "No description provided"}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4" />
              <span>{project.citationCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              <span>{project.contributorCount}</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {project.areaOfStudy || 'Uncategorized'}
            </Badge>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="ml-2">
          <StarIcon className="w-4 h-4 mr-2" />
          Star
        </Button>
      </div>
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