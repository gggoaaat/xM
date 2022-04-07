import Head from "next/head";
import React, { useReducer, useState, useEffect } from 'react';
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import bannerimg from "../../assets/images/landingpage/banner-img.png"
import NFTWalletBridge from '../../components/nftWalletBridge.js'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Whitelist from "../../components/Whitelist";
import { ethers } from "ethers";

export default function Claim() {
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
        }
      }
    }
  };

  let dappParams = { bridgeParams: bridgeParams, mintType: "Pre-Sale" }
  let walletBridge1 = NFTWalletBridge(dappParams);

  let currentUseState = walletBridge1.getUseStates();

  async function SendMint(props) {
    props.mintType = "Pre-Sale";
    if (mintNum > 0) {
      const returnedhash = await walletBridge1.sendMint(props);
    }
    setNum(0)
    if (process.env.debug) {
      console.log(returnedhash)
    }
  }

  const [formInput, updateFormInput] = useState({
    price: "",
    amount: "1",
  });

  let displayData = true ? walletBridge1.getUseStates().hash : "Loading!" //(<ul>{resultData}</ul>)

  let [mintNum, setNum] = useState(0);
  let incNum = () => {

    console.log(currentUseState.whiteListPass)
    let thisMax = currentUseState.whiteListPass == undefined ? +process.env.maxMintCount : (+currentUseState.whiteListPass.q - currentUseState.walletBalance);
    if (mintNum < thisMax) {
      console.log(mintNum)
      console.log(process.env.maxMint)
      console.log(mintNum <= +process.env.maxMint)
      setNum(Number(mintNum) + 1);
    }
  };

  let decNum = () => {
    if (mintNum > 0) {
      setNum(mintNum - 1);
    }
  }

  let handleChange = (e) => {

    if (mintNum > 1 && mintNum <= (+process.env.maxMint - currentUseState.walletBalance)) {
      setNum(e.target.value);
    }
  }

  let newValue = process.env.mintType == "Public" ? process.env.ethValue : process.env.ethWLValue;

  const whitelist = Whitelist();

  return (
    <div>
      <Head>
        <title>{process.env.siteTitle}</title>
        <meta
          name="description"
          content={process.env.siteTitle}
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div className="static-slider-head banner2">
          <Container>
            <Row className="">
              {(!currentUseState.isConnected) ?
                <Col lg="6" md="6" className="align-self-center">
                  {(currentUseState.network == "rinkeby") ? <h3 style={{ color: "#fff" }}>DEMO ONLY RINKEBY</h3> : ""}
                  <h3 className="title">
                    A blockchain project built by Community.
                  </h3>
                  <h4 className="subtitle font-light">
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
                <Col lg="6" md="6" className="align-self-center">
                  <br />                 
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
                    :
                    <h1 className="subtitle font-light">Claim mint is currently closed!</h1>
                  }
                </Col>
              }
              <Col lg="6" md="6" >
                <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
                  <Image src={bannerimg} alt="xm Logo" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    </div>
  );
}
