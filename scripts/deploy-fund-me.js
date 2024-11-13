const { network, ethers, run } = require("hardhat");

const { networkConfig, developmentChains } = require("../networkConfig");

const { deployMocks } = require("../scripts/deploy-mocks");

async function main() {
  // this get the chainId to deploy
  const chainId = await network.config.chainId;

  console.log(chainId);

  let ethUsdPriceFeed;
  if (developmentChains.includes(network.name)) {
    console.log("deploying Mocks");
    // Despliega el contrato Token
    const mocksAddress = await deployMocks();

    console.log(mocksAddress);
    ethUsdPriceFeed = mocksAddress;
  } else {
    ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  console.log("llegue hasta aca");

  const fundMeContract = await ethers.getContractFactory("FundMe");

  console.log("deploying fund me contract");
  const fundMeContractDeployed = await fundMeContract.deploy(ethUsdPriceFeed);

  console.log("verifying address");
  const fundMeContractAddressDeployed =
    await fundMeContractDeployed.getAddress();

  // await fundMeContractDeployed.fund({
  //   value: 50,
  // });

  console.log(
    "Contract Mocked deployed to address:",
    fundMeContractAddressDeployed
  );

  await run("verify:verify", {
    address: fundMeContractAddressDeployed,
    constructorArguments: [ethUsdPriceFeed],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
