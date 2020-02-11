import React, { Component } from 'react';
import SongCard from "./SongCard"
export default class SongContainer extends Component {
    render() {
        return (
          <div className="scrolling-wrapper" style={{ height: "60vh"}}>
            {this.props.songs.map(song => (
                <SongCard song={song}/>
            ))}
            
          </div>
        );
    }
}