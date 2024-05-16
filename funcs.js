import {lastfmApiKey, spotifyID, spotifyClientSecret, spotifyClientId} from "./api.js";

const submitBtn = document.querySelector('.submitBtn')

let accessToken = "temp"

const getAccessToken = () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
  
    const data = {
      grant_type: 'client_credentials',
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret
    };
  
    return fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Spotify access token data')
        console.log(data)
        console.log("Access Token Before:",accessToken)
        accessToken = data.access_token;
        console.log('Access Token After:', accessToken);
        return accessToken;
        
    })
    .catch(error => console.error('Error:', error));
  }

const getArtistImg = (access_token) => {
  const randomArtist  = getLibrary('jaredcast');
  const searchUrl = "https://api.spotify.com/v1/search?q=stereolab&type=artist"
  // const data = {
  //   q: "beethoven",
  //   type: "artist"
  // } this wont work - Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
  // return fetch(searchUrl, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization' : `Bearer ${access_token}`
  //   },
  // })
  // .then(response => response.json())
  // .then(data => {
  //   console.log(data)
  //   const artistImg = data.artists.items[0].images[0].url
  //   console.log(artistImg);
  // })
  console.log('Artist inside getartistimg', randomArtist)
  return randomArtist
}

const getLibrary = (username) => {
  const pageNum = Math.floor(Math.random() * 10) + 1;
  // const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=${apiKey}&user=${username}&format=json`;
  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=library.getArtists&user=${username}&api_key=${lastfmApiKey}&format=json&page=${pageNum}`;
  console.log("Lastfm api url")
  console.log(apiUrl);
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          var artists = data.artists.artist;
          // console.log(artists)
          var randomInt = Math.floor(Math.random() * artists.length);
          var randomArtist = artists[randomInt];
          var artistName = randomArtist.name;
          var artistScrobbles = randomArtist.playcount;
          // console.log(randomArtist.image[3]["#text"])
          console.log("Artist name inside function", artistName);
          // startGame(artistName, artistScrobbles);
          return artistName;
      })
      .catch(error => {
          console.log("ERROR: " + error);
      });;
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