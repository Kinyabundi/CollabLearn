// SPDX-License-Identifier: MIT
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
        string describtion;
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
        string describtion;
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
        string memory _describtion,
        uint256 _requiredStake,
        address _owner
    ) external  returns (uint256) {
        require(_requiredStake > MINIMUM_STAKE, "Stake too low");
        
        uint256 researchId = researchCount++;
        Research storage newResearch = researches[researchId];
        newResearch.title = _title;
        newResearch.ipfsHash = _ipfsHash;
        newResearch.describtion = _describtion;
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
                describtion: research.describtion,
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
                    describtion: research.describtion,
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
