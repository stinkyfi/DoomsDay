import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-chai-matchers"
import 'solidity-coverage'
import 'hardhat-docgen'

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
    }
  },
  gasReporter: {
    currency: "USD",
    token: "ETH",
    gasPrice: 6,    
    enabled: true,
    showTimeSpent: true,    
    coinmarketcap: ``
  },
  // etherscan: {
  //   apiKey: `${ETHERSCAN_API_KEY}`
  // }
};

export default config;
