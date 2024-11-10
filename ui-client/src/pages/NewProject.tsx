import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookCheck, Lock } from 'lucide-react';
import { ABI } from '@/abi/projectABI';
import { toast } from 'sonner';
import { useWeb3Context } from '@/context/Web3Provider';
import { useNavigate } from 'react-router-dom';

const MINIMUM_STAKE = ethers.parseEther("0.01"); 

const NewProject = () => {
  const { state } = useWeb3Context();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    visibility: 'public',
    areaOfStudy: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      // if (!state.isConnected || !state.address) {
      //   toast.error('Please connect your wallet first');
      //   return;
      // }

      if (!formData.projectName || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }

      setIsLoading(true);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get the network
      const network = await provider.getNetwork();
      console.log('Current Network:', network);

      const contractAddress = "0xBe4A130015b50e2ea3Db14ED0516319B9fEac829";
      const contract = new ethers.Contract(contractAddress, ABI, signer);

    
      // Log the parameters we're about to send
      console.log('Creating research with params:', {
        title: formData.projectName,
        ipfsHash: formData.description,
        requiredStake: MINIMUM_STAKE,
        owner: state.address
      });

      // First check if the connected account is the owner
      const contractOwner = await contract.owner();
      console.log('Contract owner:', contractOwner);
      console.log('Connected address:', state.address);

      if (!state.address || contractOwner.toLowerCase() !== state.address.toLowerCase()) {
        toast.error('Only the contract owner can create research projects');
        return;
      }

      // Create research transaction
      const tx = await contract.createResearch(
        formData.projectName,         
        formData.description,                 
        MINIMUM_STAKE,                
        state.address                
      );
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Clear form after successful creation
      setFormData({
        projectName: '',
        description: '',
        visibility: 'public',
        areaOfStudy: ''
      });
      
      toast.success('Project created successfully!');
      navigate("/app"); 

    } catch (error: any) {
      console.error('Error creating project:', error);
      
      // More detailed error logging
      if (error.reason) {
        toast.error(`Transaction failed: ${error.reason}`);
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Failed to create project. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // JSX remains the same as before
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="space-y-6 w-full max-w-2xl">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Create New Project</h2>
          <p className="text-sm italic text-gray-600">Required fields are marked with an asterisk (*)</p>
          <p className="text-sm text-gray-600 mt-2">Minimum stake: 0.01 EDU</p>
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
          <Label htmlFor="description" className="font-semibold text-sm">Description(ipfsHash) *</Label>
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
          {
           isLoading ? 'Creating Project...' : 'Create Project'}
        </Button>
      </div>
    </div>
  );
};

export default NewProject;