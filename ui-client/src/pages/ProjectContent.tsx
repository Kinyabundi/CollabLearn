import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import {  Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Download, Pencil } from 'lucide-react';
import { ABI } from '@/abi/projectABI';
import { fetchFromPinata } from '@/utils/pinata';
import { toast } from 'sonner';

interface ProjectData {
  name: string;
  file: string;
  fileCid: string;
  areaOfStudy: string;
  visibility: string;
  timestamp: string;
}

export default function ProjectContent() {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          "0xBe4A130015b50e2ea3Db14ED0516319B9fEac829",
          ABI,
          signer
        );

        const projectId = slug ? parseInt(slug) : 0;
        const research = await contract.researches(projectId);

        console.log(research)
        const data = await fetchFromPinata(research.ipfsHash);

        console.log(data)


        
        setProject(data);
      } catch (error) {
        toast.error('Failed to load project');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!project) return <div className="p-4 text-center">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {project.name}
          <Badge variant="secondary">
            {project.visibility === 'public' ? 'Public' : 'Private'}
          </Badge>
        </h1>
        <div className="flex gap-2">
          <a 
            href={getPinataUrl(project.fileCid)} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Download className="mr-2" />
              Download
            </Button>
          </a>
          <Button variant="outline">
            <Pencil className="mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Area of Study</h2>
          <p>{project.areaOfStudy}</p>
        </div>

        <div>
          <h2 className="font-semibold">Document</h2>
          <p>{project.file}</p>
          <a 
            href={getPinataUrl(project.fileCid)} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View on IPFS
          </a>
        </div>

        <div>
          <h2 className="font-semibold">Created</h2>
          <p>{new Date(project.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}