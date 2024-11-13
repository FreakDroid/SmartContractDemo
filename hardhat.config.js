require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    // With this you can set multiple versions of solidity
    compilers: [{ version: "0.8.27", version: "0.8.0", version: "0.8.8" }],
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
  namedAccounts: {
    deployer: 0, // Primera cuenta como `deployer`
    admin: 1, // Segunda cuenta como `admin`
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
  },
};
