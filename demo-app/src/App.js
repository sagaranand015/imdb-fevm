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

import ReactStars from "react-rating-stars-component";


function App() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [allMovies, setAllMovies] = useState([]);
    const [moviesLoaded, setMoviedLoaded] = useState(0);
    const [movieRating, setMovieRating] = useState({});
    const [userRating, setUserRating] = useState([]);
    const [avgRating, setAvgRating] = useState([]);
    const [showMovieRated, setShowMovieRated] = useState({});
    let [showAvgRating] = useState(false);


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
        // getAllUserRatings();
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
            for (const item of resp) {
                FetchDataFromIpfsLink(getCidFromIpfsUrl(item['ipfsHash'])).then(function (resp2) {
                    resp2.id = item.movieNumber.toNumber();
                    setAllMovies(allMovies => [...allMovies, resp2]);
                    // showRated(resp2.id);
                });
            }
        });
    }

    function getImageLinkFromCid(ipfsLink) {
        const cid = getCidFromIpfsUrl(ipfsLink);
        return `https://${cid}.ipfs.nftstorage.link`;
    }

    async function rateMovie(movieNum, ratingVal) {
        await moviesContract.hasUserRated(movieNum, {
            gasLimit: 1000000000
        }).then(function (resp) {
            console.log("========== hasUserRated Response: ", resp);
            if (!resp[0]) {
                console.log("rating val:", ratingVal, movieNum);
                moviesContract.castMovieRating(movieNum, ratingVal, {
                    gasLimit: 1000000000
                }).then(function (resp) {
                    console.log("Cast Rating: ", resp);
                    let userRatingObj = {
                        currentAccount,
                        movieNum,
                        ratingVal,
                        "showRated": true,
                    }
                    setUserRating(userRating => [...userRating, userRatingObj]);
                });
            } else {
                let userRatingObj = {
                    currentAccount,
                    "movieNum": movieNum,
                    "ratingVal": resp[1],
                    "showRated": true,
                }
                setUserRating(userRating => [...userRating, userRatingObj]);
            }
        });
    }

    function showMovieAlreadyRated(_movieNum) {
        for (const item of userRating) {
            if (item.currentAccount == currentAccount && item.movieNum == _movieNum) {
                return item.showRated;
            }
        }
        return false;
    }

    function getMovieAlreadyRatedValue(_movieNum) {
        for (const item of userRating) {
            if (item.currentAccount == currentAccount && item.movieNum == _movieNum) {
                return item.ratingVal;
            }
        }
        return 0;
    }

    function setAverageMovieRating(_movieNum) {
        console.log("get avg rating val:", _movieNum);
        moviesContract.getAvgMovieRating(_movieNum, {
            gasLimit: 1000000000
        }).then(function (resp) {
            console.log("Get Rating: ", resp, _movieNum);
            let avgRatingObj = {
                "avgRating": resp,
                "movieNum": _movieNum
            }
            setAvgRating(avgRating => [...avgRating, avgRatingObj]);
        });
    }

    function getAverageRatingValue(_movieNum) {
        for (const item of avgRating) {
            if (item.movieNum == _movieNum) {
                return item.avgRating;
            }
        }
        return 0;
    }

    function askedAvgRating(_movieNum) {
        for (const item of avgRating) {
            if (item.movieNum == _movieNum) {
                return true;
            }
        }
        return false;
    }

    // // console.log("-==-======= all movies: ", resp2);
    // console.log("======= all user ratings: ", userRating);

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

                            {
                                showMovieAlreadyRated(mov.id)
                                    ?
                                    <div>
                                        <b>You Already Rated {mov.name} with {getMovieAlreadyRatedValue(mov.id)} stars:</b>
                                    </div>
                                    :
                                    <div>
                                        <b>Add your Rating:</b>
                                        <ReactStars
                                            count={10}
                                            onChange={(newVal) => rateMovie(mov.id, newVal)}
                                            size={32}
                                            activeColor="#ffd700"
                                        />
                                    </div>
                            }


                            {
                                askedAvgRating(mov.id) && getAverageRatingValue(mov.id) != 0
                                    ?
                                    <div>
                                        <b>Average Rating:</b>
                                        <ReactStars
                                            count={10}
                                            size={32}
                                            value={getAverageRatingValue(mov.id)}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                    </div>
                                    :
                                    <ButtonGroup className="me-2" aria-label="First group">
                                        <Button variant="primary" onClick={() => setAverageMovieRating(mov.id)}>Show Average Rating</Button>
                                    </ButtonGroup>
                            }
                        </Card.Body>
                    </Card>
                ))}
            </CardGroup>

        </Container>
    );
}

export default App;
