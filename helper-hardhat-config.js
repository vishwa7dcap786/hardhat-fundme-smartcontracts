
const networkConfig={
    sepolia:{
    
        chainId:1155111,
        ethPriceFeedAddress:"0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    5:{
        name:"georli",
        ethPriceFeedAddress:"0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
}
const developmentChains=["hardhat","localhost"]
const DECIMALS = 8;
const INITIAL_ANSWER = 20000000000;

module.exports={
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}