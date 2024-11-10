import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookCheck, Lock } from 'lucide-react';
import { ABI } from '@/abi/projectABI';

const NewProject = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    visibility: 'public',
    areaOfStudy: ''
  });
  const [isLoading, setIsLoading] = useState(false);

// interface FormData {
//     projectName: string;
//     description: string;
//     visibility: string;
//     areaOfStudy: string;
// }

interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleInputChange = (e: InputChangeEvent) => {
    const { id, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [id]: value
    }));
};

const handleVisibilityChange = (value: string) => {
    setFormData(prev => ({
        ...prev,
        visibility: value
    }));
};

  const createProject = async () => {
    try {
      setIsLoading(true);
      
      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
    
      // Replace with your deployed contract address
      const contractAddress = "0xBe4A130015b50e2ea3Db14ED0516319B9fEac829";
      
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      
      // Create project transaction
      const tx = await contract.createProject(
        formData.projectName,
        formData.description,
        formData.visibility === 'private',
        formData.areaOfStudy
      );
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Clear form after successful creation
      setFormData({
        projectName: '',
        description: '',
        visibility: 'public',
        areaOfStudy: ''
      });
      
      alert('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="space-y-6 w-full max-w-2xl">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Create New Project</h2>
          <p className="text-sm italic text-gray-600">Required fields are marked with an asterisk (*).</p>
        </div>

        <div>
          <Label htmlFor="projectName" className="font-semibold text-sm">Project Name *</Label>
          <Input 
            id="projectName" 
            value={formData.projectName}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="font-semibold text-sm">Description *</Label>
          <Input 
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <RadioGroup 
            value={formData.visibility}
            onValueChange={handleVisibilityChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem value="public" id="public" />
              <BookCheck size={24} />
              <div>
                <Label htmlFor="public" className="font-bold">Public</Label>
                <p className="text-sm text-gray-600">Anyone can see this project. You choose who can contribute.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <RadioGroupItem value="private" id="private" />
              <Lock size={24} />
              <div>
                <Label htmlFor="private" className="font-bold">Private</Label>
                <p className="text-sm text-gray-600">You choose who can see and commit to this project.</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="areaOfStudy" className="font-semibold text-sm">Area of Study *</Label>
          <Input 
            id="areaOfStudy"
            value={formData.areaOfStudy}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        <Button 
          onClick={createProject} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating Project...' : 'Create Project'}
        </Button>
      </div>
    </div>
  );
};

export default NewProject;