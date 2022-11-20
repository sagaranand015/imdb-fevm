/* global BigInt */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { FetchDataFromIpfsLink, loadImgURL, UploadNftJson } from './nftStorage';
import { DEMO_MOVIE_IMAGE, MOVIES_NFT_CONTRACT_ADDRESS } from './constants';
import { MOVIES_CONTRACT_ABI } from './contract_abis';

import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import CardGroup from 'react-bootstrap/CardGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Rating';


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [moviesLoaded, setMoviedLoaded] = useState(0);
  const [movieRating, setMovieRating] = useState(0);


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

  useEffect(() => {

    // isWalletConnected();
  }, []);

  const shortenAddress = (address) => {
    if (address)
      return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)
  }

  const getCidFromIpfsUrl = (url) => {
    return url.split("\/")[2];
  }

  async function getAllMovies() {
    moviesContract.getAllMovies({
      gasLimit: 1000000000
    }).then(function (resp) {
      setMoviedLoaded(resp.length);

      // var i = 0;
      for (const item of resp) {
        FetchDataFromIpfsLink(getCidFromIpfsUrl(item['ipfsHash'])).then(function (resp2) {
          // resp2.id = i;
          console.log("-==-======= all movies: ", resp2);
          // i++;
          setAllMovies(allMovies => [...allMovies, resp2]);
        });
      }
    });
  }

  function getImageLinkFromCid(ipfsLink) {
    const cid = getCidFromIpfsUrl(ipfsLink);
    return `https://${cid}.ipfs.nftstorage.link`;
  }

  async function rateMovie(movieNum, ratingVal) {

    // let val = prompt("Give your rating from 1 to 10");
    console.log("rating val:", ratingVal, movieNum);

    movieNum = 1; // stub

    moviesContract.castMovieRating(movieNum, ratingVal, {
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log("Cast Rating: ", resp);
    });
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

      <CardGroup>
        {allMovies.map(mov => (
          <Card key={mov.id} style={{ width: '18rem' }}>
            <Card.Img height="100%" width="100%" variant="top" src={getImageLinkFromCid(mov.image)} />
            <Card.Body>
              <Card.Title>{mov.name}</Card.Title>
              <Card.Text>
                {mov.description}
              </Card.Text>
              <ButtonGroup className="me-2" aria-label="First group">
                <Button variant="success" onClick={() => rateMovie(mov.id, movieRating)}>Rate This Movie</Button>
              </ButtonGroup>
              <Rating
                  name="simple-controlled"
                  value={movieRating}
                  onChange={(event, newValue) => {
                    setMovieRating(newValue);
                  }}
                  max={10}
              />
              <ButtonGroup className="me-2" aria-label="second group">
                <Button variant="primary">See Average Rating</Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        ))}
      </CardGroup>

    </Container >
  );
}

export default App;
