const {network} = require("hardhat")
const {DECIMALS,INITIAL_ANSWER, developmentChains} = require("../helper-hardhat-config")





module.exports= async ({getNamedAccounts,deployments}) =>{
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId
    if(developmentChains.includes(network.name)){
        await deploy("MockV3Aggregator", {
        contract : "MockV3Aggregator",
        from: deployer,
        args:[DECIMALS,INITIAL_ANSWER],
        log:true,

    })
    }
}

module.exports.tags = ["all","mocks"]