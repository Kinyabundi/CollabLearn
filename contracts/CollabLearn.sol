// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// // NFT for significant contributions
// contract ContributionNFT is ERC721 {
//     constructor() ERC721("CollabLearn Contribution", "RESEARCH") {}
    
//     function mint(address to, uint256 tokenId) external {
//         _safeMint(to, tokenId);
//     }
// }
// contract CollabLearn is Ownable, ReentrancyGuard {

// constructor(
//         address _eduToken, 
//         address _nft,
//         address initialOwner
//     ) Ownable(initialOwner) {
//         eduToken = IERC20(_eduToken);
//         nft = ContributionNFT(_nft);
//     }


//     struct Research {
//         string title;
//         string ipfsHash; 
//         address owner;
//         bool isActive;
//         uint256 contributorCount;
//         uint256 citationCount;
//         uint256 requiredStake;    
//         mapping(address => bool) contributors;
//         mapping(uint256 => string) versions;  
//         mapping(address => uint256) stakes;  
//         uint256 currentVersion;
//     }
    
//     struct Contribution {
//         address contributor;
//         string ipfsHash;  
//         uint256 timestamp;
//         bool accepted;
//         uint256 votes;
//         uint256 stakedAmount;
//     }
    
//     IERC20 public eduToken;  
//     ContributionNFT public nft;
    
//     mapping(uint256 => Research) public researches;
//     mapping(uint256 => Contribution[]) public contributions;
//     mapping(address => uint256) public reputationScores;
    
//     uint256 public researchCount;
//     uint256 public constant MINIMUM_STAKE = 10**13; 
    
//     event ResearchCreated(uint256 indexed id, string title, address owner, uint256 requiredStake);
//     event ContributionSubmitted(uint256 indexed researchId, address contributor, uint256 stakedAmount);
//     event ContributionAccepted(uint256 indexed researchId, address contributor);
//     event StakeReturned(uint256 indexed researchId, address contributor, uint256 amount);
//     event StakeSlashed(uint256 indexed researchId, address contributor, uint256 amount);
    
  
//     function createResearch(
//         string memory _title,
//         string memory _ipfsHash,
//         uint256 _requiredStake
//     ) external returns (uint256) {
//         require(_requiredStake > MINIMUM_STAKE, "Stake too low");
        
//         uint256 researchId = researchCount++;
//         Research storage newResearch = researches[researchId];
//         newResearch.title = _title;
//         newResearch.ipfsHash = _ipfsHash;
//         newResearch.owner = msg.sender;
//         newResearch.isActive = true;
//         newResearch.currentVersion = 1;
//         newResearch.requiredStake = _requiredStake;
        
//         emit ResearchCreated(researchId, _title, msg.sender, _requiredStake);
//         return researchId;
//     }
    
//     function submitContribution(
//         uint256 _researchId,
//         string memory _ipfsHash
//     ) external nonReentrant {
//         Research storage research = researches[_researchId];
//         require(research.isActive, "Research not active");
//         require(!research.contributors[msg.sender], "Already contributed");
        
//         uint256 stakeAmount = research.requiredStake;
//         require(eduToken.transferFrom(msg.sender, address(this), stakeAmount), 
//                 "Stake transfer failed");
        
//         research.stakes[msg.sender] = stakeAmount;
        
//         contributions[_researchId].push(Contribution({
//             contributor: msg.sender,
//             ipfsHash: _ipfsHash,
//             timestamp: block.timestamp,
//             accepted: false,
//             votes: 0,
//             stakedAmount: stakeAmount
//         }));
        
//         emit ContributionSubmitted(_researchId, msg.sender, stakeAmount);
//     }
    
//     function voteOnContribution(
//         uint256 _researchId,
//         uint256 _contributionId
//     ) external {
//         require(reputationScores[msg.sender] > 0, "No reputation to vote");
//         contributions[_researchId][_contributionId].votes++;
        
//         if (contributions[_researchId][_contributionId].votes >= 3) {
//             acceptContribution(_researchId, _contributionId);
//         }
//     }
    
//     function acceptContribution(
//         uint256 _researchId,
//         uint256 _contributionId
//     ) public nonReentrant {
//         Research storage research = researches[_researchId];
//         Contribution storage contribution = contributions[_researchId][_contributionId];
//         require(!contribution.accepted, "Already accepted");
        
//         contribution.accepted = true;
//         research.contributors[contribution.contributor] = true;
//         research.contributorCount++;
        
//         // Return stake with bonus
//         uint256 stakeAmount = research.stakes[contribution.contributor];
//         uint256 bonus = (stakeAmount * 10) / 100; // 10% bonus
//         require(eduToken.transfer(contribution.contributor, stakeAmount + bonus), 
//                 "Reward transfer failed");
        
//         // Increase reputation
//         reputationScores[contribution.contributor] += 100;
        
//         // Mint NFT for significant contributions
//         if (contribution.votes >= 5) {
//             nft.mint(contribution.contributor, _researchId * 1000 + _contributionId);
//         }
        
//         emit ContributionAccepted(_researchId, contribution.contributor);
//         emit StakeReturned(_researchId, contribution.contributor, stakeAmount + bonus);
//     }
    
//     function slashStake(
//         uint256 _researchId,
//         uint256 _contributionId
//     ) external onlyOwner nonReentrant {
//         Research storage research = researches[_researchId];
//         Contribution storage contribution = contributions[_researchId][_contributionId];
//         require(!contribution.accepted, "Cannot slash accepted contribution");
        
//         uint256 stakeAmount = research.stakes[contribution.contributor];
//         research.stakes[contribution.contributor] = 0;
        
//         // Transfer slashed stake to treasury/platform
//         require(eduToken.transfer(owner(), stakeAmount), "Slash transfer failed");
        
//         emit StakeSlashed(_researchId, contribution.contributor, stakeAmount);
//     }
    
//     function updateResearchVersion(
//         uint256 _researchId,
//         string memory _newIpfsHash
//     ) external {
//         Research storage research = researches[_researchId];
//         require(msg.sender == research.owner, "Not owner");
        
//         research.versions[research.currentVersion] = research.ipfsHash;
//         research.currentVersion++;
//         research.ipfsHash = _newIpfsHash;
//     }
// }



pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ContributionNFT is ERC721 {
    constructor() ERC721("CollabLearn Contribution", "RESEARCH") {}
    
    function mint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }
}

contract CollabLearn is Ownable, ReentrancyGuard {
    constructor(
        address _eduToken, 
        address _nft,
        address initialOwner
    ) Ownable(initialOwner) {
        eduToken = IERC20(_eduToken);
        nft = ContributionNFT(_nft);
    }

    struct User {
        address userAddress;
        string username;
    }

    struct Research {
        string title;
        string ipfsHash; 
        address owner;
        bool isActive;
        uint256 contributorCount;
        uint256 citationCount;
        uint256 requiredStake;    
        mapping(address => bool) contributors;
        mapping(uint256 => string) versions;  
        mapping(address => uint256) stakes;  
        uint256 currentVersion;
    }
    
    struct ResearchInfo {
        uint256 id;
        string title;
        string ipfsHash;
        address owner;
        bool isActive;
        uint256 contributorCount;
        uint256 citationCount;
        uint256 requiredStake;
        uint256 currentVersion;
    }
    
    struct Contribution {
        address contributor;
        string ipfsHash;  
        uint256 timestamp;
        bool accepted;
        uint256 votes;
        uint256 stakedAmount;
    }
    
    IERC20 public eduToken;  
    ContributionNFT public nft;
    
    mapping(uint256 => Research) public researches;
    mapping(uint256 => Contribution[]) public contributions;
    mapping(address => uint256) public reputationScores;
    mapping(address => User) public users;
    
    uint256 public researchCount;
    uint256 public constant MINIMUM_STAKE = 10**13;

    event ResearchCreated(uint256 indexed id, string title, address owner, uint256 requiredStake);
    event UserCreated(address indexed userAddress, string username);

    modifier onlyResearchOwner(uint256 _researchId) {
        require(researches[_researchId].owner == msg.sender, "Only the research owner can perform this action");
        _;
    }

    function createUser(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(users[msg.sender].userAddress == address(0), "User already exists");

        users[msg.sender] = User({
            userAddress: msg.sender,
            username: _username
        });

        emit UserCreated(msg.sender, _username);
    }

    function createResearch(
        string memory _title,
        string memory _ipfsHash,
        uint256 _requiredStake,
        address _owner
    ) external onlyOwner returns (uint256) {
        require(_requiredStake > MINIMUM_STAKE, "Stake too low");
        
        uint256 researchId = researchCount++;
        Research storage newResearch = researches[researchId];
        newResearch.title = _title;
        newResearch.ipfsHash = _ipfsHash;
        newResearch.owner = _owner;
        newResearch.isActive = true;
        newResearch.currentVersion = 1;
        newResearch.requiredStake = _requiredStake;
        
        emit ResearchCreated(researchId, _title, _owner, _requiredStake);
        return researchId;
    }
    
    function getAllResearches() external view returns (ResearchInfo[] memory) {
        ResearchInfo[] memory allResearches = new ResearchInfo[](researchCount);
        
        for (uint256 i = 0; i < researchCount; i++) {
            Research storage research = researches[i];
            allResearches[i] = ResearchInfo({
                id: i,
                title: research.title,
                ipfsHash: research.ipfsHash,
                owner: research.owner,
                isActive: research.isActive,
                contributorCount: research.contributorCount,
                citationCount: research.citationCount,
                requiredStake: research.requiredStake,
                currentVersion: research.currentVersion
            });
        }
        
        return allResearches;
    }

    function getResearchesByOwner(address _owner) external view returns (ResearchInfo[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < researchCount; i++) {
            if (researches[i].owner == _owner) {
                count++;
            }
        }

        ResearchInfo[] memory ownerResearches = new ResearchInfo[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < researchCount; i++) {
            if (researches[i].owner == _owner) {
                Research storage research = researches[i];
                ownerResearches[index] = ResearchInfo({
                    id: i,
                    title: research.title,
                    ipfsHash: research.ipfsHash,
                    owner: research.owner,
                    isActive: research.isActive,
                    contributorCount: research.contributorCount,
                    citationCount: research.citationCount,
                    requiredStake: research.requiredStake,
                    currentVersion: research.currentVersion
                });
                index++;
            }
        }

        return ownerResearches;
    }
}
