/* global BigInt */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { FetchDataFromIpfsLink, UploadNftJson } from './nftStorage';
import { DEMO_MOVIE_IMAGE, MOVIES_NFT_CONTRACT_ADDRESS } from './constants';
import { MOVIES_CONTRACT_ABI } from './contract_abis';

import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [allMovies, setAllMovies] = useState([]);

  // metamsk methereum references for all user interactions
  const { ethereum } = window
  const pr = new ethers.providers.Web3Provider(ethereum);
  const signer = pr.getSigner()

  let m = [];

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
          getAllMovies();
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
            getAllMovies();
          });
      }
    };
    // isWalletConnected();
  }, [allMovies]);

  const shortenAddress = (address) => {
    if (address)
      return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)
  }

  const getCidFromIpfsUrl = (url) => {
    return url.split("\/")[2];
  }

  function getMoviesPayload(resp){
    m = [];
    return new Promise(() => {
      for (let item of resp) {
        FetchDataFromIpfsLink(getCidFromIpfsUrl(resp[0]['ipfsHash'])).then(function (resp) {
          console.log("-==-======= all movies: ", resp);
          m.push(resp);
        });
      }
      return m;
    })
  }


  async function getAllMovies() {
    m = [];
    moviesContract.getAllMovies({
      gasLimit: 1000000000
    }).then(function (resp) {
      for (let item of resp) {
        FetchDataFromIpfsLink(getCidFromIpfsUrl(resp[0]['ipfsHash'])).then(function (resp) {
          console.log("-==-======= all movies: ", resp);
          m.push(resp);
          setAllMovies(m);
        });
      }
    })
    //     .then(() => {
    //       setAllMovies(m);
    //       console.log("all movies: ", allMovies);
    //     }
    // )
    ;
  }

  return (
    <Container>
      <Navbar bg="light">
        <Nav className="mx-right">
          {currentAccount ?
            <Button variant="dark">Wallet Connected</Button>
            :
            <Button variant="dark" onClick={connectWalletHandler}>Connect Wallet</Button>
          }
        </Nav>
      </Navbar>

      {/*<img src={require('./logo.jpeg')} />*/}
      {allMovies.map(mov => (
        <Card key={mov} style={{ width: '18rem' }}>
          <Card.Img variant="top" src={require('./logo.jpeg')} />
          <Card.Body>
            <Card.Title>mov.name</Card.Title>
            <Card.Text>
              mov.description
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      ))}

    </Container>
  );
}

export default App;
