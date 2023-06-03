const {verify} = require("../utils/verify")
require("dotenv").config()

const { network } = require("hardhat")
// const netConfig = require("../helper-hardhat-config")
// const networkConfig = netConfig.networkConfig
const{ networkConfig,developmentChains }= require("../helper-hardhat-config")

// module.exports = async (hre) => {
//     const {getNamedAccounts,deployments} = hre
   
// }
//alternative:::
// async function deployfunc(hre){
//  console.log("HI")
// }
// modelue.exports.default = deployfunc         //HERE default is used to make deployfunc as default func to call 
// alternative:::
// using module.exports to export this async anonymous func as the default function for hardhat deploy to for
module.exports =  async ({getNamedAccounts,deployments}) => {
    const {deploy , log ,get}  =  deployments
    const {deployer}  = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethPriceFeedAddress;
    if(developmentChains.includes(network.name)){
      const AggregatorV3Interface = await get("MockV3Aggregator")
      ethPriceFeedAddress = AggregatorV3Interface.address;
      
    }  
    else{
      ethPriceFeedAddress = networkConfig[network.name]["ethPriceFeedAddress"]
    }
    const args = [ethPriceFeedAddress]
    
    const FundMe = await deploy("FundMe",{
        contract: "FundMe",
        from:deployer,
        args:args,
        log:true
    })
    
  
    if(!developmentChains.includes(network.name)&& process.env.ETHERSCAN_API_KEY){
        console.log(process.env.ETHERSCAN_API_KEY)

       await verify(FundMe.address,args)
    }
    

}

module.exports.tags = ["all", "fundMe"] 
   
