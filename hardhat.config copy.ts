import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-chai-matchers"

const PRIVATE_KEY = ""
const ALCHEMY_API_KEY = ""
const COINMARKETCAP_API_KEY = ""
const ETHERSCAN_API_KEY = ""

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  gasReporter: {
    currency: "USD",
    token: "ETH",
    gasPrice: 6,    
    enabled: true,
    showTimeSpent: true,    
    coinmarketcap: `${COINMARKETCAP_API_KEY}`
  },
  // etherscan: {
  //   apiKey: `${ETHERSCAN_API_KEY}`
  // }
};

export default config;
