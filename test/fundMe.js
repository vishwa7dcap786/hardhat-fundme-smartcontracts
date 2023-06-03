const { assert ,expect} = require("chai")
const {network,getNamedAccounts,ethers, deployments,} = require("hardhat")

const { developmentChains } = require("../helper-hardhat-config")


describe("FundMe" ,async function () {
   
    let deployer
    let fundMe
    let mockV3Aggregator
    const sendvalue = ethers.utils.parseEther("1")
    beforeEach(async  ()=>{
        // const accounts = await ethers.getSigners()
        // deployer = accounts[0]
        // const  {deployer} = await getNamedAccounts()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        

        fundMe = await ethers.getContract("FundMe",deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer)

        
    
     


    })

    describe("constructor" ,async function (){
        it("ethPriceFeedAddress is equal to mockV3Aggregator",async () => {
            
            
            const ethPriceFeedAddresses = await fundMe.CurrentPriceFeedAddress()
            
            assert.equal(ethPriceFeedAddresses , mockV3Aggregator.address)
        })
        
    })
    describe("fundme",async function (){
        
        it("calling fundme should be reverted" ,async function(){
            await expect( fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
        })           
        it("it should update the amount", async function(){
            await fundMe.fund({value:sendvalue})
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(),sendvalue.toString())
        })                  
        it("add funders to funders array" , async function(){
            await fundMe.fund({value:sendvalue})
            const response = await fundMe.funders(0)
            assert.equal(response, deployer)
        })                      
    })
    describe("withdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value:sendvalue})
        })
        it("current balance  ", async function(){
            const startingfunderbalance = await fundMe.provider.getBalance(deployer)
            const startingfundmebalance = await fundMe.provider.getBalance(fundMe.address)

            const transactionresponse = await fundMe.withdraw()
            const transactionreceipt = await transactionresponse.wait() 
            const {gasUsed , effectiveGasPrice} = transactionreceipt
            const gasCost = gasUsed.mul(effectiveGasPrice) 
            const endingfunderbalance = await fundMe.provider.getBalance(deployer)
            const endingfundmebalance = await fundMe.provider.getBalance(fundMe.address)



            assert.equal(startingfundmebalance.add(startingfunderbalance).toString(), endingfunderbalance.add(gasCost).toString())
        })
        it("withdraw from every funders", async function(){
            const accounts = await ethers.getSigners()
            for(let i=1;i<6;i++)
            {
                const connectedaccount = await fundMe.connect(accounts[i])
                await connectedaccount.fund({value:sendvalue})

            }  

            const startingfunderbalance = await fundMe.provider.getBalance(deployer)
            const startingfundmebalance = await fundMe.provider.getBalance(fundMe.address)

            const transactionresponse = await fundMe.withdraw()
            const transactionreceipt = await transactionresponse.wait()
            const {gasUsed , effectiveGasPrice} = transactionreceipt 
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingfunderbalance = await fundMe.provider.getBalance(deployer)
            assert.equal(startingfunderbalance.add(startingfundmebalance).toString(),endingfunderbalance.add(gasCost).toString())

            await expect(fundMe.addressToAmountFunded(accounts[0])).to.be.reverted

            for(i=1;i<6;i++){
        
                assert.equal(await fundMe.addressToAmountFunded(accounts[i].address),0)
            }

        })
        it("it only allows the owner to withdraw the fund" , async function(){
           const accounts = await ethers.getSigners()
           const connectedaccount = await fundMe.connect(accounts[1])
            await expect(connectedaccount.withdraw()).to.be.reverted
        })
    })
})