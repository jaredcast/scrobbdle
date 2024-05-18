import {lastfmApiKey, spotifyID, spotifyClientSecret, spotifyClientId} from "./api.js";

const submitBtn = document.querySelector('.submitBtn');
const game = document.querySelector('.game');
const artistPhoto = document.querySelector('.artistPhoto');
let accessToken = "temp";
let artistImg = ""

//Get the access tokens to use for Spotify
const getAccessToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
  
    const spotifyInfo = {
      grant_type: 'client_credentials',
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret
    };
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      body: new URLSearchParams(spotifyInfo)
    })
    const tokenData = await response.json();
    console.log('Spotify access token data')
    console.log(tokenData)
    console.log("Access Token Before:",accessToken)
    accessToken = tokenData.access_token;
    console.log('Access Token After:', accessToken);
    return accessToken;
  }

const getArtistImg = async (access_token) => {
  var randomArtist  = await getLibrary('jaredcast');
  randomArtist = randomArtist.replaceAll(' ', '+');
  // console.log('Artist inside getartistimg', randomArtist)
  const searchUrl = `https://api.spotify.com/v1/search?q=${randomArtist}&type=artist`
  console.log('Random artist', randomArtist);
  console.log('Spotify search url for image - getArtistImg function,',searchUrl);
  // const data = {
  //   q: "beethoven",
  //   type: "artist"
  // } this wont work - Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
  return fetch(searchUrl, {
    method: 'GET',
    headers: {
      'Authorization' : `Bearer ${access_token}`
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log("Spotify data - getArtistImg function")
    console.log(data)
    artistImg = data.artists.items[0].images[0].url
    console.log(artistImg);
    startGame();
    // return artistImg;
  })
  
  // return randomArtist
}

const getLibrary = async (username) => {
  const pageNum = Math.floor(Math.random() * 10) + 1;
  // const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=${apiKey}&user=${username}&format=json`;
  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=library.getArtists&user=${username}&api_key=${lastfmApiKey}&format=json&page=${pageNum}`;
  console.log("Lastfm api url inside getLibrary function")
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  var artists = data.artists.artist;
  // console.log(artists)
  var randomInt = Math.floor(Math.random() * artists.length);
  var randomArtist = artists[randomInt];
  var artistName = randomArtist.name;
  var artistScrobbles = randomArtist.playcount;
  // console.log(randomArtist.image[3]["#text"])
  console.log("Artist name inside getLibrary function", artistName);
  // startGame(artistName, artistScrobbles);
  return artistName;
}

//Starts the actual game upon successful API requests from Spotify API and LastFM API
const startGame = () => {
  console.log("GAME BEGINS");
  game.style.display = '';
  artistPhoto.src=artistImg;
}


getAccessToken()
    .then(accessToken => {
      console.log("ACCESS TOKEN: ", accessToken);
      
      submitBtn.addEventListener('click', (e) => {
        getArtistImg(accessToken);
        e.preventDefault() //https://stackoverflow.com/questions/19454310/stop-form-refreshing-page-on-submit
      })
    })
    .catch(error => {
      console.log("ERROR FOUND WITH ACCESS TOKEN", error);
    })

// getLibrary('jaredcast');