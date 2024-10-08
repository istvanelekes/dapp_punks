import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

import preview from '../preview.png'
// Components
import Navigation from './Navigation'
import Loading from './Loading'
import Data from './Data'
import Mint from './Mint'
import NFTList from './NFTList.js'

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNft] = useState(null)

  const [account, setAccount] = useState(null)

  const [revealTime, setRevealTime] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [lastNFT, setLastNFT] = useState(0)
  const [tokenIds, setTokenIds] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const nft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider)
    setNft(nft)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch last minted NFT
    const tokenIds = await nft.walletOfOwner(account)
    setLastNFT(tokenIds[tokenIds.length - 1])
    setTokenIds(tokenIds)

    // Fetch Countdown
    const allowMintingOn = await nft.allowMintingOn()
    setRevealTime(allowMintingOn.toString() + '000')

    setMaxSupply(await nft.maxSupply())
    setTotalSupply(await nft.totalSupply())
    setCost(await nft.cost())
    setBalance(await nft.balanceOf(account))
    setIsWhitelisted(await nft.isWhitelisted(account))

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  const imgUri = (tokenId) => {
    return `https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${tokenId}.png`
  }

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>Dapp Punks</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              {balance > 0 ? (
                <div className='text-center'>
                  <img 
                    src={ imgUri(lastNFT.toString()) }
                    alt="Open Punk"
                    width='400px'
                    height='400px'
                  />
                </div>
              ) : (
                <img src={preview} alt="" />
              )}
            </Col>
            <Col>
              <div className='my-4 text-center'>
                <Countdown date={parseInt(revealTime)} className='h2' />
              </div>

              <Data maxSupply={maxSupply} totalSupply={totalSupply} cost={cost} balance={balance}/>
              <Mint provider={provider} nft={nft} cost={cost} isWhitelisted={isWhitelisted} setIsLoading={setIsLoading}/>
              <NFTList tokenIds={tokenIds} imgUri={imgUri} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
