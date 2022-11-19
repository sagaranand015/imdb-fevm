// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MoviesNFT is ERC721URIStorage {
    // uint256 MAX_RATING_COUNT = 100000000000;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct movieData {
        uint256 movieNumber;
        string movieName;
        string ipfsHash;
    }

    struct rating {
        address ratingOwner; // address who made the rating
        uint256 movieNumber; // number of the movie for which the rating is being casted
        uint8 ratingVal; // must be between 1(min rate) and 10(max rate)
        uint256 createdAt; // timestamp of rating
    }

    movieData[] public moviesArr;
    mapping(uint256 => movieData) public movies;

    rating[] ratings;
    mapping(address => rating) userRating;
    mapping(address => uint256[]) userMovieRating;

    constructor() ERC721("MovieNFT", "MNFT") {}

    function createNFT(
        address creator,
        string memory name,
        string memory ipfsHash
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newMovieId = _tokenIds.current();
        movieData memory nextMovie = movieData(newMovieId, name, ipfsHash);

        movies[newMovieId] = nextMovie;
        moviesArr.push(nextMovie);
        _mint(creator, newMovieId);
        _setTokenURI(newMovieId, ipfsHash);
        return newMovieId;
    }

    function getAllMovies() public view returns (movieData[] memory) {
        return moviesArr;
    }

    function getMovieByNumber(uint256 _movieNum)
        public
        view
        returns (movieData memory)
    {
        return movies[_movieNum];
    }

    function castMovieRating(uint256 _movieNum, uint8 ratingVal) public {
        for (uint256 i = 0; i < ratings.length; i++) {
            if (
                ratings[i].ratingOwner == msg.sender &&
                ratings[i].movieNumber == _movieNum
            ) {
                require(1 == 2, "Movie cannot be rated twice");
            }
        }

        rating memory r = rating(
            msg.sender,
            _movieNum,
            ratingVal,
            block.timestamp
        );

        userRating[msg.sender] = r;
        ratings.push(r);
    }

    function getAvgMovieRating(uint256 _movieNum) public view returns (uint8) {
        uint256 s = 0;
        uint256 n = 0;
        for (uint256 i = 0; i < ratings.length; i++) {
            if (ratings[i].movieNumber == _movieNum) {
                s = s + ratings[i].ratingVal;
                n++;
            }
        }
        uint8 avg = uint8(s / n);
        return avg;
    }

    function getUserRating(address userAdd)
        public
        view
        returns (bool, rating memory)
    {
        rating memory rs = userRating[userAdd];
        if (rs.ratingVal > 0) {
            return (true, rs);
        }
        return (false, rs);
    }

    function getAllRatings() public view returns (rating[] memory) {
        return ratings;
    }
}
