/* global BigInt */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { FetchDataFromIpfsLink, UploadNftJson } from './nftStorage';
import { BATMAN_BEGINS, DEMO_MOVIE_IMAGE, MOVIES_NFT_CONTRACT_ADDRESS } from './constants';
import { MOVIES_CONTRACT_ABI } from './contract_abis';

import Accordion from 'react-bootstrap/Accordion';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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
    document.title = 'W3MDB Admin App - Create your Movie/Creation';
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

  async function createMovieNft() {
    // 1. Create the IPFS link of the JSON file
    // 2. Call the smart contract method and get the tokenId
    let m_name = "The Dark Knight";
    let m_desc = "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.";
    let m_release = "2008";
    let m_director = "Christopher Nolan";
    let m_image = "ipfs://bafybeidnh3ibfhhhh7eshmltt2bz72ueet73dh2paqfozrkfntvqtcn7ri";
    await UploadNftJson(m_name, m_desc, m_release, m_director, m_image, {
      "name": m_name,
      "description": m_desc,
      "director": m_director,
      "release": m_release,
      "imageURL": m_image,
    }).then(function (resp) {
      console.log("======== response of nft.storage is: ", resp);
      const ipfsUrl = `ipfs://${resp}`
      console.log("======== final ipfs url: ", ipfsUrl);

      console.log("========== creating moviesNft with currentAccount: ", currentAccount);

      moviesContract.createNFT(currentAccount, m_name,
        ipfsUrl, {
        gasLimit: 1000000000
      }).then(function (resp) {
        console.log("========= created movies NFT: ", resp);
      });

    });
  }

  async function getAllMovies() {
    moviesContract.getAllMovies({
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log("========= getAllMovies response: ", resp);
    });
  }

  async function getMovieByNumber(movieNum) {
    moviesContract.getMovieByNumber(movieNum, {
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log(`Movie Data from Blockchain & IPFS. TokenId: ${resp[0]}, Name: ${resp[1]}, Ipfs: ${resp[2]}`);
      const ipfsMetadata = resp[2];
      FetchDataFromIpfsLink(ipfsMetadata.split("\/")[2]);
    });
  }

  // async function getMovieRatingsByNumber(movieNum) {
  //   moviesContract.getMovieRatings(movieNum, {
  //     gasLimit: '3000000'
  //   }).then(function (resp) {
  //     // console.log(`Movie Ratings:. Address: ${resp[0]}, MovieNum: ${resp[1]}, ratingVal: ${resp[2]}, createdAt: ${resp[3]}`);
  //     console.log("Movie Ratings: ", resp);
  //   });
  // }

  async function castMovieRating(movieNum, ratingVal) {
    moviesContract.castMovieRating(movieNum, ratingVal, {
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log("Cast Rating: ", resp);
    });
  }

  async function getUserRatings() {
    moviesContract.getUserRating(currentAccount, {
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log("User Ratings Response:", resp);
    });
  }

  async function getAvgForMovie(movieNum) {
    moviesContract.getAvgMovieRating(movieNum, {
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log("Average Rating Response:", resp);
    });
  }

  async function getAllRatings() {
    moviesContract.getAllRatings({
      gasLimit: 1000000000
    }).then(function (resp) {
      console.log("All Ratings Response:", resp);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <ButtonGroup className="me-2" aria-label="First group">
          <Button variant="primary" onClick={connectWalletHandler}>Connect Wallet</Button>
        </ButtonGroup>

        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Create Movie NFT</Accordion.Header>
            <Accordion.Body>
              <h3>Create the Movie NFT with the following details:</h3>
              <p>Name: The Dark KNight</p>
              <p>Demo Image: <a target="_blank" href='https://bafkreieddeiyxsyk7x6twdshl74fpfvcro5riwj4vfxo5zty3pdfzvf73m.ipfs.nftstorage.link' >Here</a></p>
              <Button variant="primary" onClick={createMovieNft}>Create Movie NFT</Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* <button onClick={getAllMovies}>Get all movies</button> */}

        {/* <button onClick={createMovieNft}>Create Movie NFT</button>
        <button onClick={getAllMovies}>Get all movies</button>
        <button onClick={() => getMovieByNumber(1)}>Get Movie with TokenId: 1</button>
        <button onClick={() => getMovieByNumber(2)}>Get Movie with TokenId: 2</button>
        <button onClick={() => castMovieRating(1, 10)}>Cast rating: 10 to movie: 1</button>
        <button onClick={() => castMovieRating(2, 8)}>Cast rating: 8 to movie: 2</button>
        <button onClick={() => getMovieRatingsByNumber(2)}>Get Movie Ratings with TokenId: 1</button>
        <button onClick={() => getUserRatings()}>Get Current User Ratings</button>
        <button onClick={() => getAvgForMovie(1)}>Get Average Rating of Movie: 1</button>
        <button onClick={() => getAllRatings()}>Get All Ratings</button> */}
        <br />

      </header>
    </div >
  );
}

export default App;
