import React, { Component } from "react";
import backgroundimage from "../images/bluebackground1.png";
import spotifywhitelogo from "../images/spotifywhitelogo.png";
import SongContainer from "./SongContainer";
import SongListContainer from "./SongListContainer";
import { Link } from "react-router-dom";


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
      this.getArtistSongs(artistsIds).then(firstArtistsSongs => {
        let artistSongs = firstArtistsSongs.flat(Infinity)
        console.log(artistSongs)
        let originalArtistSongs = this.randomizeArtistTracks(artistSongs);
          // console.log(originalArtistSongs)
      this.getArtistAlbumSongs(artistsIds).then(firstArtistsAlbumSongs => {
        let artistAlbumSongs = firstArtistsAlbumSongs.flat(Infinity)
        console.log(artistAlbumSongs)
        let originalArtistAlbumSongs = this.randomizeArtistAlbumTracks(artistAlbumSongs);
          // console.log(originalArtistAlbumSongs)
        this.getSimilarArtistsSongs(artistsIds).then(relatedArtistsSongs => {
          let similarArtistsSongs = relatedArtistsSongs.flat(Infinity)
          console.log(similarArtistsSongs)
          let alikeArtistSongs = this.randomizeTracks(similarArtistsSongs);
          // console.log(alikeArtistSongs)
          let SongList = [...originalArtistSongs, ...originalArtistAlbumSongs];
          let finalSongList = [...SongList, ...alikeArtistSongs];

          this.setState({ Songs: finalSongList }); 
          console.log(finalSongList)  
        });
      });
    });
  })
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



  

  getArtistAlbumSongs(artistsIds) {
    return Promise.all(
      artistsIds.map(artistId => {
        return fetch(
          `https://api.spotify.com/v1/artists/${artistId}/albums?limit=15`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.accesstoken.access_token}`
            }
          }
        )
          .then(res => res.json())
          .then(artistalbums => {
            let albumIds = artistalbums.items.map(item => item.id)
            // console.log(albumIds)

            return Promise.all(
              albumIds.map(albumId => {
                return fetch(
                  `https://api.spotify.com/v1/albums/${albumId}/tracks`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${this.state.accesstoken.access_token}`
                    }
                  }
                )
                  .then(res => res.json())
                  .then(albumsongs => {
                    let albumSongNames = albumsongs.items.map(item => item.name)
                    console.log(albumSongNames)
                    let albumSongIds = albumsongs.items.map(item => item.id)
                    // console.log(albumSongIds)
                                    
                    return Promise.all(
                      albumSongIds.map(albumSongId => {
                        return fetch(
                          `https://api.spotify.com/v1/tracks/${albumSongId}`,
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
                            // console.log(artistsongs)
                            return artistsongs
                          });
                      })
                    );
                  });
              })
            );
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
    while (i <= 30) {
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

  randomizeArtistAlbumTracks(artistAlbumSongs) {
    let randomSongs = [];
    let i = 1;
    while (i <= 16) {
      let randomIndex = Math.floor(Math.random() * artistAlbumSongs.length);
      let randomsong = artistAlbumSongs[randomIndex];
      artistAlbumSongs.splice(randomIndex, 1);
      randomSongs.push(randomsong);
      i++;
    }

    return randomSongs;
  }

  userAuthorization = () => {
    const client_id = "0724f13286da41eb90bef57cebcc0202";
    const redirect_uri = encodeURIComponent("http://localhost:3000/save_token");
    const state = "8732T4ERYG23GR";
    window.location.replace(
      `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=user-read-private%20playlist-modify-public&state=${state}`
    );
  };

  saveUserPlaylist = access_token => {
    this.getUserData(access_token).then(userId => {
      this.createUserPlaylist(access_token, userId).then(playlistId => {
        this.addSongsToPlaylist(access_token, playlistId);
        console.log(playlistId);
      });
      console.log(userId);
    });
  };

  getUserData = access_token => {
    return fetch(`https://api.spotify.com/v1/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(res => res.json())
      .then(userdata => {
        return userdata.id;
      });
  };

  createUserPlaylist = (access_token, userId) => {
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify({
        name: "Love Your Music",
        description: "A unique playlist just for you"
      })
    })
      .then(res => res.json())
      .then(playlistdata => {
        return playlistdata.id;
      });
  };

  addSongsToPlaylist = (access_token, playlistId) => {
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({
        uris: this.state.Songs.map(song => {
          return song.uri;
        })
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        return res;
      });
  };

  render() {
    const access_token = this.props.match.params.access_token;
    return (
      <div 
        style={{
          height: "56vh",
          width: "100vw",
          background: "rgb(148,60,255)",
          background:
            "linear-gradient(90deg, rgba(148,60,255,1) 0%, rgba(221,69,211,1) 41%, rgba(252,154,87,1) 90%)"    
        }}
      >
        <header className="header">
          <h1 className="logo">
            <a href="/deluxeedition">
              <img
                src={spotifywhitelogo}
                style={{ width: "200px", left: "800px" }}
              />
            </a>
          </h1>
          <ul className="main-nav">
            {/* <li>
              <a href="#">Premium</a>
            </li>
            <li>
              <a href="#">Help</a>
            </li> */}
            {/* <li>
              <a href="#">Download</a>
            </li> */}
            <li>
              <a href="/home">Home</a>

              {/* <Link> {to="/home"}</Link> */}
            </li>
          </ul>
        </header>

        <h1 className="header1">Love Your Music</h1>
        <p className="text1">
          Make the playlist of your dreams based on artists
        </p>

        <form
          onSubmit={e => {
            e.preventDefault();
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
                required="required"
              />
              <button className="search" type="submit">
                Playlist
              </button>
            </div>
          </div>
        </form>

        <br></br>

        {access_token ? (
          <button
            className="button3"
            onClick={() => this.saveUserPlaylist(access_token)}
          >
            Save Playlist
          </button>
        ) : (
          <button className="button3" onClick={() => this.userAuthorization()}>
            Authorize with Spotify
          </button>
        )}

        <button className="button4" onClick={null}>
          Make new playlist
        </button>

        <h1 className="h1margin">Here Are Your Songs</h1>

        <SongContainer songs={this.state.Songs}/>
        <SongListContainer songs={this.state.Songs} />
      </div>
    );
  }
}
