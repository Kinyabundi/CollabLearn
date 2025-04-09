import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Pencil, FileText, Calendar, Bookmark, Eye, ExternalLink } from "lucide-react";
import { ABI } from "@/abi/projectABI";
import { fetchFromPinata, getPinataUrl } from "@/utils/pinata";
import { toast } from "sonner";

interface ProjectData {
  name: string;
  originalFilename: string;
  fileType: string;
  fileCid: string;
  areaOfStudy: string;
  visibility: string;
  timestamp: string;
}

export default function ProjectContent() {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentLink, setDocumentLink] = useState<string | null>(null);
  const navigate = useNavigate();

  const onClickEdit = () => {
    navigate(`/app/edit-project-document/${slug}`);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          "0x72d62F5849B6F22Fe4000478355270b8e776D6Db",
          ABI,
          signer
        );

        const projectId = slug ? parseInt(slug) : 0;
        const research = await contract.researches(projectId);

        console.log(research)

        const data = await fetchFromPinata(research.ipfsHash);
        const rawData = data.data as unknown as ProjectData;

        setProject(rawData);
        const fileCid = rawData.fileCid;
        const ipfsHash = await getPinataUrl(fileCid);
        setDocumentLink(ipfsHash);
      } catch (error) {
        toast.error("Failed to load project");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full mx-auto p-6 text-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FileText size={48} className="text-gray-400" />
              <h2 className="text-xl font-medium">Project not found</h2>
              <p className="text-gray-500">The requested project could not be found or may have been deleted.</p>
              <Button onClick={() => navigate('/app/projects')}>Back to Projects</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge className="capitalize" variant={project.visibility === "public" ? "default" : "secondary"}>
              <Eye className="mr-1 h-3 w-3" />
              {project.visibility}
            </Badge>
          </div>
          <div className="flex gap-2">
            {documentLink && (
              <a href={documentLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </a>
            )}
            <Button variant="default" onClick={onClickEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Area of Study</h3>
                  <p className="font-medium">{project.areaOfStudy}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                  <p className="font-medium">{project.originalFilename}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {new Date(project.timestamp).toLocaleString()}
                  </p>
                </div>
                {documentLink && (
                  <>
                    <Separator />
                    <a
                      href={documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on IPFS
                    </a>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentLink ? (
                  <div className="border rounded-md overflow-hidden bg-gray-50">
                    <iframe
                      src={documentLink}
                      className="w-full h-96"
                      title="Document Preview"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-md border">
                    <p className="text-gray-500">Document preview not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}