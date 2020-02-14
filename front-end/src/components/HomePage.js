import React, { Component } from 'react';
import {Link} from "react-router-dom";
export default class HomePage extends Component {
    render() {
        return (
          <div
            style={{
              height: "100vh",
              width: "100vw",
              background: "rgb(148,60,255)",
              background:
                "linear-gradient(90deg, rgba(148,60,255,1) 0%, rgba(221,69,211,1) 41%, rgba(252,154,87,1) 90%)"
            }}
          >
            <Link to="/playlist">
              <button className="button5">Make Your Playlist</button>
            </Link>

            <h1 className="header2">Music for everyone.</h1>
            <p className="text2">
              Make a playlist here. Use it Everywhere.
            </p>
          </div>
        );
    }
}