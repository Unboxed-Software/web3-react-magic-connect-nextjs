import { MetaMask } from "@web3-react/metamask"
import type { Connector } from "@web3-react/types"
import { MagicConnect } from "web3-react-magic"

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return "MetaMask"
  if (connector instanceof MagicConnect) return "Magic Connect"
  return "Unknown"
}

/*
  Handler function to attempt to mint an NFT from the collection
*/

interface TxData {
  hash?: string
  tokenId?: number
}

export async function requestMintNFT(address, contract, provider) {
  console.log(`Request to mint an NFT to address ${address}...`)

  let txData: TxData = {}

  try {
    const name = await contract.methods.name().call()
    // console.log("Name:", name);

    // check the balance of the address
    const balance = await provider.getBalance(address)
    console.log(address)
    console.log("Balance:", balance.toString())

    // estimate the amount of gas required
    const gas = await contract.methods
      .safeMint(address)
      .estimateGas({ from: address })
    console.log(`Estimated gas: ${gas}`)

    // Get the current gas price
    const gasPrice = await provider.getGasPrice()
    console.log("Gas price:", gasPrice.toString())

    // Calculate the total cost of the transaction (gas * gasPrice)
    const transactionCost = gasPrice.mul(gas)
    console.log("Transaction cost:", transactionCost.toString())

    // Check if the address has enough funds to cover the gas fee
    if (balance.lt(transactionCost)) {
      alert("Insufficient funds to cover the gas fee")
      return
    }

    // construct and send the mint request to the blockchain
    const receipt = await contract.methods
      .safeMint(address)
      .send({
        from: address,
        gas,
      })
      .on("transactionHash", (hash) => {
        txData = { hash }
        console.log("Transaction hash:", hash)
      })
      .then((receipt) => {
        console.log("Transaction receipt:", receipt)

        // extract the minted tokenId from the transaction response
        const tokenId = receipt?.events?.Transfer?.returnValues?.tokenId
        console.log("Minted tokenId:", tokenId)
        txData.tokenId = tokenId

        return txData
      })
      .catch((err) => {
        console.error(err)
        throw err
      })

    return txData
  } catch (error) {
    console.error(error)
    return false
  }
}

/*
  Helper function to fetch all the metadata URIs from
  the collection (owned by the given `address`)
*/
export async function fetchNFTs(address, contract) {
  console.log(`Fetch the NFTs owned by ${address} from the collection...`)

  try {
    // get the total count of tokens owned by the `address`
    const tokenBalance = await contract.methods.balanceOf(address).call()
    // console.log("tokenBalance:", tokenBalance);

    // init tracking arrays
    let promisesForIds = []
    let promisesForUris = []
    let tokens = []

    // build the listing of promises to fetch the owned token IDs
    for (let i = 0; i < tokenBalance; i++) {
      promisesForIds.push(
        await contract.methods
          .tokenOfOwnerByIndex(address, i)
          .call()
          .then((tokenIndex) => {
            // console.log(`token ID ${tokenIndex} found`);
            return tokenIndex
          })
          .catch((err) => console.warn(err))
      )
    }

    // await all promises to fetch the owned token IDs
    const tokenIDs = (await Promise.allSettled(promisesForIds)) as {
      status: "fulfilled" | "rejected"
      value: number
    }[]
    for (let i = 0; i < tokenIDs.length; i++) {
      // console.log(tokenIDs[i]);

      // add each token id to the next round of promises
      promisesForUris.push(
        await contract.methods
          .tokenURI(tokenIDs[i].value)
          .call()
          .then((uri) => {
            uri = ipfsToHttps(uri)
            // console.log(`Token ID ${result.value} has URI of ${uri}`);
            tokens.push(uri)
            return uri
          })
          .catch((err) => console.warn(err))
      )
    }

    // await all promises for fetching the token URIs
    await Promise.allSettled(promisesForUris)

    console.log("Total NFTs found:", tokens?.length)

    return tokens
  } catch (err) {
    console.error(err)
    return false
  }
}

/*
  Wrapper function to fetch a token's JSON metadata from the given URI stored on-chain
*/
export async function fetchJSONfromURI(url) {
  // console.log(`Fetching metadata from ${url}...`);
  return fetch(ipfsToHttps(url))
    .then((res) => res?.json())
    .then((res) => {
      return res
    })
    .catch((err) => {
      console.error(err)
    })
}

/*
  parse ipfs address into https
*/
export function ipfsToHttps(uri) {
  uri = uri.replace("ipfs://", "https://nftstorage.link/ipfs/").toString()
  return uri
}
