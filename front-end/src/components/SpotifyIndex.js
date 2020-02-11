import React, { Component } from "react";
import backgroundimage from "../images/bluebackground1.png";
import spotifywhitelogo from "../images/spotifywhitelogo.png";
import SongContainer from "./SongContainer"
import SongListContainer from "./SongListContainer"

import "../css/style.css";

window.getSongs = artistNames => {
  return new Promise(resolve => {
    let songs = [];

    resolve(songs);
  });
};

export default class SpotifyIndex extends Component {
  state = {
    accesstoken: [],
    Songs: []
  };

  // client_id = "0724f13286da41eb90bef57cebcc0202"
  // client_secret = "095c882ed46444a5b878e0b99d9dcd28"

  componentDidMount() {
    const client_id = "0724f13286da41eb90bef57cebcc0202";
    const client_secret = "095c882ed46444a5b878e0b99d9dcd28";
    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
      },
      body: body
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ accesstoken: res });
      });
  }

  handleSubmit = inputvalues => {
    this.getArtistIds(inputvalues).then(artistsIds => {
      this.getArtistSongs(artistsIds).then(artistSongs => {
        let newArtistSongs = artistSongs.flat(Infinity)
        console.log(newArtistSongs);
        let searchedArtistSongs = this.randomizeArtistTracks(newArtistSongs)
        console.log(searchedArtistSongs)
        this.getSimilarArtistsSongs(artistsIds).then(similarArtistSongs => {
          let newsongs = similarArtistSongs.flat(Infinity);
          console.log(newsongs);
          let searchedSongs = this.randomizeTracks(newsongs);
          console.log(searchedSongs);
          let finalSongList = [...searchedArtistSongs, ...searchedSongs]
          this.setState({Songs: finalSongList})
          console.log(finalSongList)
        });
      });
    });
  };

  getArtistIds(inputvalues) {
    let artistNames = inputvalues;
    let artistArray = artistNames.split(",");
    return Promise.all(
      artistArray.map(artist => {
        return (
          fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              artist
            )}&type=artist&limit=10`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.state.accesstoken.access_token}`
              }
            }
          )
            .then(res => res.json())
            // .then(artistinfo => console.log(artistinfo.artists.items[0].id))
            .then(artistinfo => {
              return artistinfo.artists.items[0].id;
            })
        );
      })
    );
  }

  getArtistSongs(artistsIds) {
    return Promise.all(
      artistsIds.map(artistId => {
        return fetch(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.accesstoken.access_token}`
            }
          }
        )
          .then(res => res.json())
          .then(artistsongs => {
            return artistsongs.tracks;
          });
      })
    );
  }

  getSimilarArtistsSongs(artistsIds) {
    return Promise.all(
      artistsIds.map(artistId => {
        return fetch(
          `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.accesstoken.access_token}`
            }
          }
        )
          .then(res => res.json())
          .then(similaratists => {
            return Promise.all(
              similaratists.artists.map(similartists => {
                return fetch(
                  `https://api.spotify.com/v1/artists/${similartists.id}/top-tracks?country=US`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${this.state.accesstoken.access_token}`
                    }
                  }
                )
                  .then(res => res.json())
                  .then(artist => artist.tracks);
              })
            );
          });
      })
    );
  }

  randomizeTracks(newsongs) {
    let randomSongs = [];
    let i = 1;
    while (i <= 35) {
      let randomIndex = Math.floor(Math.random() * newsongs.length);
      let randomsong = newsongs[randomIndex];
      newsongs.splice(randomIndex, 1);
      randomSongs.push(randomsong);
      i++;
    }

    return randomSongs;
  }

   randomizeArtistTracks(newArtistSongs) {
    let randomSongs = [];
    let i = 1;
    while (i <= 10) {
      let randomIndex = Math.floor(Math.random() * newArtistSongs.length);
      let randomsong = newArtistSongs[randomIndex];
      newArtistSongs.splice(randomIndex, 1);
      randomSongs.push(randomsong);
      i++;
    }

    return randomSongs;
  }


  

  render() {
    return (
      <div
        style={{
          height: "56vh",
 background: "rgb(148,60,255)",
background: "linear-gradient(90deg, rgba(148,60,255,1) 0%, rgba(221,69,211,1) 41%, rgba(252,154,87,1) 90%)"
        }}
      >
        <header className="header">
          <h1 className="logo">
            <a href="#">
              <img
                src={spotifywhitelogo}
                style={{ width: "200px", left: "800px" }}
              />
            </a>
          </h1>
          <ul className="main-nav">
            <li>
              <a href="#">Premium</a>
            </li>
            <li>
              <a href="#">Help</a>
            </li>
            <li>
              <a href="#">Download</a>
            </li>
            <li>
              <a href="#">Profile</a>
            </li>
          </ul>
        </header>

        <h1 className="header1">Love Your Music</h1>
        <p className="text1">Make the playlist of your dreams based on artists</p>


        <form
          onSubmit={e => {
            e.preventDefault();
            // console.log(e.target[0].value);
            this.handleSubmit(e.target[0].value);
          }}
        >
          <div className="box">
            <div className="container">
              <span className="icon">
                <i className="fa fa-search"></i>
              </span>
              <input
                type="search"
                id="search"
                placeholder="Enter Artist Names..."
              />
              <button className="search" type="submit">
                Playlist
              </button>
            </div>
          </div>
        </form>

        <br></br>

        <h1 className="h1margin">Here Are Your Songs</h1>

        <SongContainer songs={this.state.Songs} />
        <SongListContainer songs={this.state.Songs}/>

        
      </div>
    );
  }
}

