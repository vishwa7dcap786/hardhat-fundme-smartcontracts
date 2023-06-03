require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("@nomiclabs/hardhat-waffle")
require("solidity-coverage")
require("hardhat-gas-reporter")

ETHERSCAN_API_KEY =process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks:{
    sepolia:
    {
      url:process.env.SEPOLIA_RPC_URL,
      accounts:[process.env.PRIVATE_KEY],
      chainId:11155111,
      
    },

  },
  
  namedAccounts:{
    deployer:{
      default: 0 ,
    },
  },
  verify: {etherscan: {
       apikey:ETHERSCAN_API_KEY,
  
  
  },},
  solidity: 
    {
      compilers:[{version:"0.8.19"},]
      },
  gasReporter:{
    enable:true,
    currency:USD,
  }
};


