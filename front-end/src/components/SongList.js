import React, { Component } from 'react';
export default class SongList extends Component {
    render() {
        return (
              
        <li class="w3-bar">
    {/* <span onclick="this.parentElement.style.display='none'" class="w3-bar-item w3-button w3-white w3-xlarge w3-right">{this.props.song.duration_ms}/</span> */}
      <img src={this.props.song.album.images[1].url} class="w3-bar-item w3-circle w3-hide-small" style={{width:"85px"}}/>
      <div class="w3-bar-item">
          <div className="pinkpurplecolor">
        <span class="w3-large">{this.props.song.name}</span>
        </div><br></br>
        <div className="songlistartist">
        <span>{this.props.song.artists[0].name}</span>
        </div>
      </div>
    </li>

             
        );
    }
}