export type TProjectResearch = {
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

export type TReseachItem = {
  name: string;
  file: string;
  fileCid: string;
  areaOfStudy: string;
  visibility: string;
  timestamp: string;
};
