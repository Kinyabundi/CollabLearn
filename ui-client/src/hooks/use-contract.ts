import { ABI } from "@/abi/projectABI";
import { CONTRACT_ADDRESS } from "@/constants";
import { TReseachItem } from "@/types/Project";
import { fetchFromPinata, getPinataUrl } from "@/utils/pinata";
import { ethers } from "ethers";

const getSigner = async () => {
	const provider = new ethers.BrowserProvider(window.ethereum);
	const signer = await provider.getSigner();
	return signer;
};

const useContract = () => {
	const getContract = async () => {
		const signer = await getSigner();
		const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
		return contract;
	};

	const getResearch = async (projectId: number) => {
		const contract = await getContract();
		const research = await contract.researches(projectId);
		const data = await fetchFromPinata(research.ipfsHash);

		return data.data as unknown as TReseachItem;
	};

	const getResearchById = async (projectId: number) => {
		const contract = await getContract();
		const research = await contract.researches(projectId);
		return research;
	};

	const getDocumentIPFSLink = async (fileCid: string) => {
		const ipfsHash = await getPinataUrl(fileCid);

		return ipfsHash;
	};

	return {
		getContract,
		getResearch,
		getResearchById,
		getDocumentIPFSLink,
	};
};

export default useContract;
