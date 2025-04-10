import TextEditor from "@/components/editor";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { TReseachItem } from "@/types/Project";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { ethers } from "ethers";
import { ABI } from "@/abi/projectABI";
import { fetchFromPinata, getPinataUrl } from "@/utils/pinata";

interface ProjectData extends TReseachItem {
  originalFilename?: string;
  fileType?: string;
  areaOfStudy?: string;
  visibility?: string;
  timestamp?: string;
}

const EditProjectDocument = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [initialContent, setInitialContent] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<string>("");
  const [editorKey, setEditorKey] = useState<number>(0);
  const [editorReady, setEditorReady] = useState<boolean>(false);

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

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4411/convert", { 
        method: "POST", 
        body: formData 
      });

      if (!response.ok) throw new Error("Conversion failed");
      
      const { data: htmlContent } = await response.json();
      console.log("Converted content from file upload:", htmlContent);
      
      // Set editor to not ready before updating content
      setEditorReady(false);
      setInitialContent(DOMPurify.sanitize(htmlContent));
      
      // Force remount the editor with a slight delay to ensure state is updated
      setTimeout(() => {
        setEditorKey(prev => prev + 1);
        setEditorReady(true);
        setLoading(false);
      }, 100);
    } catch (err) {
      toast.error("Failed to convert file");
      console.error("Error converting file:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProject = async () => {
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
        console.log("File URL from IPFS:", fileUrl);
        
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
        
        const convertResult = await convertResponse.json();
        console.log("Conversion result:", convertResult);
        
        if (convertResult.success && convertResult.data) {
          const sanitizedHtml = DOMPurify.sanitize(convertResult.data);
          console.log("Sanitized HTML to display:", sanitizedHtml);
          
          // Set editor to not ready before updating content
          setEditorReady(false);
          setInitialContent(sanitizedHtml);
          
          // Force remount the editor with a slight delay
          setTimeout(() => {
            setEditorKey(prev => prev + 1);
            setEditorReady(true);
            setLoading(false);
          }, 100);
        } else {
          throw new Error("Conversion returned invalid data");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Failed to load project");
        console.error("Error loading project:", error);
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  // Function to check if TextEditor component is mounting properly
  const handleEditorMount = () => {
    console.log("TextEditor component mounted successfully with content:", 
      initialContent ? initialContent.substring(0, 50) + "..." : "No content");
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {project && (
        <RoomProvider id={`document-${slug}`}>
          <ClientSideSuspense fallback={<Loading />}>
            {() => (
              <div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                  >
                    Import from Word
                  </Button>
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => {
                      setEditorReady(false);
                      setTimeout(() => {
                        setEditorKey(prev => prev + 1);
                        setEditorReady(true);
                        console.log("Editor refreshed with content:", initialContent.substring(0, 50) + "...");
                      }, 100);
                    }}
                    disabled={loading}
                  >
                    Refresh Editor
                  </Button>
                  <input 
                    type="file" 
                    accept=".docx,.doc,.pdf,.txt" 
                    className="hidden" 
                    ref={inputRef} 
                    onChange={onFileChange} 
                  />
                </div>
                
                {/* Loading indicator during content processing */}
                {loading && (
                  <div className="flex justify-center my-4">
                    <Loading />
                  </div>
                )}
                
                {/* Debug display of content */}
                <div className="mb-4 p-2 border border-gray-300 rounded">
                  <h3 className="font-bold">Content Preview (Debug):</h3>
                  <div 
                    className="p-2 max-h-40 overflow-auto bg-gray-50" 
                    dangerouslySetInnerHTML={{ __html: initialContent }} 
                  />
                </div>
                
                {/* Actual editor */}
                <div className="border p-4 rounded-md">
                  {initialContent && editorReady ? (
                    <TextEditor 
                      key={editorKey}
                      initialContent={initialContent}
                      // onMount={handleEditorMount}
                    />
                  ) : (
                    <div className="text-center p-6 text-gray-500">
                      {loading ? 
                        "Loading document content..." : 
                        "No content available. Please import a document."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </ClientSideSuspense>
        </RoomProvider>
      )}
    </div>
  );
};

export default EditProjectDocument;