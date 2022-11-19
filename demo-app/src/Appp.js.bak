/* global BigInt */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { FetchDataFromIpfsLink, UploadNftJson } from './nftStorage';
import { DEMO_MOVIE_IMAGE, MOVIES_NFT_CONTRACT_ADDRESS } from './constants';
import { MOVIES_CONTRACT_ABI } from './contract_abis';
// import HeaderComponent from './components/Header';

import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  // metamsk methereum references for all user interactions
  const { ethereum } = window
  const pr = new ethers.providers.Web3Provider(ethereum);
  const signer = pr.getSigner()

  // references to the moviesNFT
  const moviesContract = new ethers.Contract(
    MOVIES_NFT_CONTRACT_ADDRESS,
    MOVIES_CONTRACT_ABI,
    signer
  );

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please Install Metamask');
    }
    try {
      await ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(function (accounts) {
          setCurrentAccount(accounts[0]);
          console.log(
            '======= Wallet connected, got the address: ',
            accounts[0],
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const isWalletConnected = async () => {
      if (window.ethereum) {
        await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(function (accounts) {
            setCurrentAccount(accounts[0]);
          });
      }
    };
    isWalletConnected();
  }, []);

  const shortenAddress = (address) => {
    if (address)
      return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)
  }

  return (
    <Navbar bg="light">
      <Nav className="mx-right">
        <Button variant="dark" onClick={connectWalletHandler}>Connect Wallet</Button>
      </Nav>
    </Navbar>
  );
}

export default App;
