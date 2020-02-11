import React, { Component } from 'react';
import SongList from "./SongList"
export default class SongListContainer extends Component {

    render() {
        return (
          <div>
            <h1 className="songlistcontainer">Full Song List</h1>
            <div class="w3-container">
              <ul class="w3-ul w3-card-4">
                {this.props.songs.map(song => (
                  <SongList song={song} />
                ))}
              </ul>
            </div>
          </div>
        );
    }
}