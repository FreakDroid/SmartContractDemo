const { network, ethers } = require("hardhat");
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER_V3_AGGREGATOR,
} = require("../networkConfig");

async function deployMocks() {
  if (developmentChains.includes(network.name)) {
    console.log(
      "I should load the mocks because I'm in localhost or hardhat local"
    );

    // Despliega el contrato usando el signer directamente
    const mocks = await ethers.getContractFactory("MockV3Aggregator");
    const contractDeployed = await mocks.deploy(
      DECIMALS,
      INITIAL_ANSWER_V3_AGGREGATOR
    );

    // await market.deplyed();

    const contractAddressDeployed = await contractDeployed.getAddress();

    console.log(
      "Contract Mocked deployed to address:",
      contractAddressDeployed
    );

    return contractAddressDeployed;
  }
}

module.exports = { deployMocks };
