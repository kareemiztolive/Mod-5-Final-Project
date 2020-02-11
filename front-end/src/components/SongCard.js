import React, { Component } from 'react';
export default class SongCard extends Component {
    render() {
        return (
          <div className="card">
            <a href={this.props.song.external_urls.spotify} target="_blank">
              <img src={this.props.song.album.images[1].url} />
            </a>
            <h4 className="songnametext">{this.props.song.name}</h4>
            <h1 className="songartisttext">{this.props.song.artists[0].name}</h1>
          </div>
        );
    }
}