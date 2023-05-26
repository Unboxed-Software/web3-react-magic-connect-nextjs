/*
  Handler function to attempt to mint an NFT from the collection
*/

// Define the interface for the transaction data to return
interface TxData {
  hash?: string
  tokenId?: number
}

// Define the function to request the minting of an NFT
export async function requestMintNFT(address, contract, provider) {
  // console.log(`Request to mint an NFT to address ${address}...`)

  try {
    // Use Promise.all() to execute multiple promises concurrently and retrieve their results
    const [name, balance, gas, gasPrice] = await Promise.all([
      contract.methods.name().call(),
      provider.getBalance(address),
      contract.methods.safeMint(address).estimateGas({ from: address }),
      provider.getGasPrice(),
    ])

    // // Log info to the console
    // console.log("Name:", name)
    // console.log("Address:", address)
    // console.log("Balance:", balance.toString())
    // console.log(`Estimated gas: ${gas}`)
    // console.log("Gas price:", gasPrice.toString())

    // Calculate the estimated transaction cost based on gas and gas price
    const transactionCost = gasPrice.mul(gas)
    // console.log("Transaction cost:", transactionCost.toString())

    // If the balance is less than the transaction cost, display an alert and return
    if (balance.lt(transactionCost)) {
      alert("Insufficient funds to cover the gas fee")
      return
    }

    // Send the minting transaction and listen for the transaction hash
    const receipt = await contract.methods
      .safeMint(address)
      .send({
        from: address,
        gas,
      })
      .on("transactionHash", (hash) => {
        // console.log("Transaction hash:", hash)
      })

    // Log the transaction receipt to the console
    // console.log("Transaction receipt:", receipt)

    // Retrieve the minted tokenId from the transaction receipt events
    const tokenId = receipt?.events?.Transfer?.returnValues?.tokenId
    // console.log("Minted tokenId:", tokenId)

    // Create the transaction data object with the transaction hash and tokenId
    const txData: TxData = {
      hash: receipt.transactionHash,
      tokenId,
    }

    // Return the transaction data
    return txData
  } catch (error) {
    console.error(error)
    return false
  }
}
