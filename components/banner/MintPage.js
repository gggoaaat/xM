import React, { useReducer, useState, useEffect } from 'react';
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import bannerimg from "../../assets/images/landingpage/banner-img.png"
import NFTWalletBridge from '../nftWalletBridge'
import WalletConnectProvider from "@walletconnect/web3-provider";


const MintPage = () => {
  const bridgeParams = {
    tokenAddress: process.env.contractAddress,
    providerOptions: {
      metamask: {
        id: 'injected',
        name: 'MetaMask',
        type: 'injected',
        check: 'isMetaMask'
      },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          rpc: {
            56: 'https://bsc-dataseed.binance.org/'
          },
          network: process.env.network,
          chainId: process.env.chainId,
          infuraId: process.env.infuraID, // "b830c8484bf841d795848610ff791d5b", // required
          address: process.env.contractAddress //,
          // qrcodeModalOptions: {
          //     mobileLinks: [
          //         'rainbow',
          //         'metamask',
          //         'argent',
          //         'trust',
          //         'imtoken',
          //         'pillar'
          //     ]
          // }
        }
      }
    }
  };

  let dappParams = { bridgeParams: bridgeParams, mintType: "Public" }
  let walletBridge1 = NFTWalletBridge(dappParams);

  let currentUseState = walletBridge1.getUseStates();

  async function SendMint(props) {

    props.mintType = "Public";
    if (mintNum > 0) {
      const returnedhash = await walletBridge1.sendMint(props);
    }
    // setNum(0)
  }

  const [formInput, updateFormInput] = useState({
    price: "",
    amount: "1",
  });

  let displayData = true ? walletBridge1.getUseStates().hash : "Loading!" //(<ul>{resultData}</ul>)

  let [mintNum, setNum] = useState(1);
  let incNum = () => {
    if (mintNum < +process.env.maxMintCount) {
      console.log(mintNum)
      console.log(process.env.maxMint)
      console.log(mintNum <= +process.env.maxMint)
      setNum(Number(mintNum) + 1);
    }
  };

  let decNum = () => {
    if (mintNum > 1) {
      setNum(mintNum - 1);
    }
  }

  let handleChange = (e) => {
    if (mintNum > 1 && mintNum <= +process.env.maxMint) {
      setNum(e.target.value);
    }
  }

  let newValue = dappParams.mintType == "Public" ? process.env.ethValue : process.env.ethWLValue;

  return (
    <>
      <div className="static-slider-head banner2">
        <Container>
          <Row className="">
            {(!currentUseState.isConnected) ?
              <Col lg="6" md="6" className="align-self-center">
                {(currentUseState.network == "rinkeby") ? <h3 style={{ color: "#fff" }}>DEMO ONLY RINKEBY</h3> : ""}
                <h3 className="title" style={{ color: "#fff", backgroundColor: "RGB(0,0,0,0.2)" }}>
                  A blockchain project built by Community.
                </h3>
                <h4 className="subtitle font-light" style={{ color: "#000", backgroundColor: "RGB(255,255,255,0.8)" }}>
                  An organic collective consisting of miners living on the Ethereum blockchain
                  <br />
                </h4>
                <a
                  onClick={() => walletBridge1.showWeb3Modal()}
                  className="btn btn-success m-r-20 btn-md m-t-30 " style={{ backgroundColor: "#C2C2C2" }}
                >
                  Connect Wallet
                </a>
                <Link href={process.env.mainWWW}>
                  <a className="btn btn-md m-t-30  btn-outline-light " style={{ backgroundColor: "#760680" }}>
                    Back Home
                  </a>
                </Link>
              </Col> :
              <Col lg="8" md="8" className="align-self-center">
                <>
                    <>
                      <br />
                      <p className="connected" style={{ backgroundColor: "RGB(0,0,0,0.9)", padding: "5px" }}>
                        {dappParams.mintType} Mint Cost : <strong>{newValue} ETH</strong>
                        <br />
                        Wallet address: <strong>{currentUseState.xmPower.filteredAddress}</strong>
                        <br />
                        {process.env.nativeCurrency} Balance : <strong>{currentUseState.xmPower.theBalance}</strong>
                        <br />
                        {process.env.contractCurrency} Balance : <strong>{currentUseState.xmPower.contractBalance}</strong>
                        <br />
                        Contract : <strong>{process.env.contractAddress}</strong>
                        <br />
                      </p>                      
                      <a
                        onClick={() => walletBridge1.disconnect()}
                        className="btn btn-md m-t-30 btn-outline-light "
                      >
                        Disconnect Wallet
                      </a>
                      <br />
                      <br />
                      <h4 className="subtitle font-light">
                        {/* NFT&apos;s minted {currentUseState.numMinted} of {process.env.maxMint} */}
                      </h4>
                      <br />
                      {currentUseState.hashHtml}
                    </>                                     
                </>
              </Col>
            }
            <Col lg="4" md="4" >
              <div style={{ padding: "50px" }}>
                <Image src={bannerimg} alt="Eminent Logo" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MintPage;
