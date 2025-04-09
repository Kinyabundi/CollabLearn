// src/pages/NewProject.tsx
import { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookCheck, Lock, Upload, FileText } from 'lucide-react';
import { ABI } from '@/abi/projectABI';
import { toast } from 'sonner';
import { useWeb3Context } from '@/context/Web3Provider';
import { useNavigate } from 'react-router-dom';
import { uploadFileToPinata, uploadJsonToPinata } from '@/utils/pinata';

const MINIMUM_STAKE = ethers.parseEther("0.01");

export default function NewProject() {
  const { state } = useWeb3Context();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    areaOfStudy: '',
    visibility: 'public'
  });
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setCid(''); // Reset CID when new file is selected
    }
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setIsLoading(true);
      
      // Upload the original file to IPFS
      const fileCid = await uploadFileToPinata(file);
      
      // Create metadata including file info
      const metadata = {
        ...form,
        originalFilename: file.name,
        fileType: file.type,
        fileCid,
        timestamp: new Date().toISOString()
      };
      
      // Upload metadata to IPFS
      const metadataCid = await uploadJsonToPinata(metadata);
      setCid(metadataCid);
      
      toast.success('File uploaded to IPFS!');
    } catch (error) {
      toast.error('Upload failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    if (!cid) {
      toast.error('Please upload a file first');
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0x72d62F5849B6F22Fe4000478355270b8e776D6Db",
        ABI,
        signer
      );

      const tx = await contract.createResearch(
        form.name,
        cid,
        form.description,
        MINIMUM_STAKE,
        state.address
      );

      await tx.wait();
      toast.success('Project created!');
      navigate('/app');
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create New Project</h1>
      
      <div>
        <Label>Project Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          placeholder="Enter project name"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          placeholder="Enter project description"
        />
      </div>

      <div>
        <Label>Upload Document</Label>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".docx,.doc,.pdf,.txt"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            {file ? <FileText className="mr-2" /> : <Upload className="mr-2" />}
            {file ? file.name : 'Select File'}
          </Button>
          <Button
            onClick={uploadFile}
            disabled={!file || isLoading}
          >
            Upload
          </Button>
        </div>
      </div>

      {cid && (
        <div className="p-3 bg-gray-100 rounded">
          <p className="text-sm font-mono break-all">CID: {cid}</p>
        </div>
      )}

      <div>
        <Label>Area of Study</Label>
        <Input
          value={form.areaOfStudy}
          onChange={(e) => setForm({...form, areaOfStudy: e.target.value})}
          placeholder="Enter area of study"
        />
      </div>

      <RadioGroup
        value={form.visibility}
        onValueChange={(v) => setForm({...form, visibility: v})}
      >
        <div className="flex items-center gap-3">
          <RadioGroupItem value="public" />
          <BookCheck />
          <Label>Public</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="private" />
          <Lock />
          <Label>Private</Label>
        </div>
      </RadioGroup>

      <Button
        onClick={createProject}
        disabled={!cid || isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Create Project'}
      </Button>
    </div>
  );
}