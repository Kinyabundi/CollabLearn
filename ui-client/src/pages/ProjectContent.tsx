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
import DOMPurify from "dompurify";

interface ProjectData {
  name: string;
  originalFilename?: string; // Make optional since it might be missing
  fileType?: string;
  fileCid: string;
  areaOfStudy?: string;
  visibility?: string;
  timestamp?: string;
}

export default function ProjectContent() {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentLink, setDocumentLink] = useState<string | null>(null);
  const [convertedHtml, setConvertedHtml] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState<string>(""); // Track file extension separately
  const navigate = useNavigate();

  const onClickEdit = () => {
    navigate(`/app/edit-project-document/${slug}`);
  };

  const convertDocxToHtml = async (url: string) => {
    try {
      // Fetch the file content from IPFS
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a FormData object with the file
      const formData = new FormData();
      const filename = project?.originalFilename || `document.${fileExtension || 'docx'}`;
      formData.append("file", blob, filename);
      
      // Send to your conversion endpoint
      const convertResponse = await fetch("http://localhost:4411/convert", {
        method: "POST",
        body: formData
      });
      
      if (!convertResponse.ok) {
        throw new Error("Failed to convert file");
      }
      
      const data = await convertResponse.json();
      const htmlContent = data.data;
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);
      setConvertedHtml(sanitizedHtml);
    } catch (error) {
      console.error("Error converting file:", error);
      toast.error("Failed to convert document for preview");
    }
  };

  const detectFileTypeFromContentType = (contentType: string | null) => {
    if (contentType?.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return 'docx';
    } else if (contentType?.includes('application/msword')) {
      return 'doc';
    } else if (contentType?.includes('application/pdf')) {
      return 'pdf';
    } else if (contentType?.includes('text/plain')) {
      return 'txt';
    } else {
      return 'unknown';
    }
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
        const data = await fetchFromPinata(research.ipfsHash);
        const rawData = data.data as unknown as ProjectData;
  
        setProject(rawData);
        const fileCid = rawData.fileCid;
  
        const fileUrl = await getPinataUrl(fileCid);
        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) throw new Error("Failed to fetch document");
        const contentType = fileResponse.headers.get('Content-Type');
        const fileBlob = await fileResponse.blob();
        setFileExtension(detectFileTypeFromContentType(contentType));

        const formData = new FormData();
        formData.append("file", fileBlob, rawData.originalFilename || `document.${fileExtension}`);
        const convertResponse = await fetch("http://localhost:4411/convert", {
          method: "POST",
          body: formData,
        });
  
        if (!convertResponse.ok) throw new Error("Conversion failed");
        const { data: htmlContent } = await convertResponse.json();
        const sanitizedHtml = DOMPurify.sanitize(htmlContent);
        setConvertedHtml(sanitizedHtml);
  
        // Create HTML blob URL for preview
        const htmlBlob = new Blob([sanitizedHtml], { type: "text/html" });
        const htmlUrl = URL.createObjectURL(htmlBlob);
        setDocumentLink(htmlUrl);
      } catch (error) {
        toast.error("Failed to load project");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProject();
  
    return () => {
      if (documentLink) URL.revokeObjectURL(documentLink);
    };
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

  // Using the fileExtension state instead of checking originalFilename directly
  const isDocFile = fileExtension === 'docx' || fileExtension === 'doc';
  const isPdfFile = fileExtension === 'pdf';
  const isTextFile = fileExtension === 'txt';

  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge className="capitalize" variant={project.visibility === "public" ? "default" : "secondary"}>
              <Eye className="mr-1 h-3 w-3" />
              {project.visibility || "public"}
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
                  <p className="font-medium">{project.areaOfStudy || "Not specified"}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                  <p className="font-medium">
                    {project.originalFilename || `Document.${fileExtension || 'unknown'}`}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {project.timestamp ? new Date(project.timestamp).toLocaleString() : "Unknown"}
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
                    {/* For Word documents, show the converted HTML */}
                    {isDocFile && convertedHtml ? (
                      <div 
                        className="w-full h-96 overflow-auto p-4"
                        dangerouslySetInnerHTML={{ __html: convertedHtml }}
                      />
                    ) : isPdfFile ? (
                      <iframe
                        src={documentLink}
                        className="w-full h-96"
                        title="Document Preview"
                      />
                    ) : isTextFile ? (
                      <iframe
                        src={documentLink}
                        className="w-full h-96"
                        title="Document Preview"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-md border">
                        <p className="text-gray-500">Preview not available for this file type. <a href={documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download the file</a> to view it.</p>
                      </div>
                    )}
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