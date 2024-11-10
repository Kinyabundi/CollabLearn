const hre = require("hardhat");

async function main() {
  // Deploy ContributionNFT
  const ContributionNFT = await hre.ethers.deployContract("ContributionNFT");
  await ContributionNFT.waitForDeployment();
  console.log(`ContributionNFT deployed to: ${ContributionNFT.target}`);

  // Deploy CollabLearn with constructor arguments
  const CollabLearn = await hre.ethers.deployContract("CollabLearn", [
    '0xf8173a39c56a554837C4C7f104153A005D284D11',
    ContributionNFT.target,   
    await hre.ethers.provider.getSigner().then(signer => signer.getAddress())
  ]);
  await CollabLearn.waitForDeployment();
  console.log(`CollabLearn deployed to: ${CollabLearn.target}`);

  // Verify contracts on Etherscan (optional)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contracts...");
    await hre.run("verify:verify", {
      address: EduToken.target,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: ContributionNFT.target,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: CollabLearn.target,
      constructorArguments: [
        EduToken.target,
        ContributionNFT.target,
        await hre.ethers.provider.getSigner().getAddress()
      ],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });