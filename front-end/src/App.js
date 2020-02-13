import React, { Component } from "react";
import SpotifyIndex from "./components/SpotifyIndex";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

export default class App extends Component {
  state = {
    loggedInUser: null
  };

  setLoggedInUser = user => {
    this.setState({
      loggedInUser: user
    });
  };

  render() {
    return (
      <div>
        {/* <SpotifyIndex /> */}

        <BrowserRouter>
          <Route
            exact
            path="/playlist"
            component={props => <SpotifyIndex {...props} />}
          />
          <Route
            exact
            path="/playlist/:access_token"
            component={props => <SpotifyIndex {...props} />}
          />
          <Route exact path="/sign-up" component={SignUp} />
          <Route
            exact
            path="/login"
            component={() => (
              <Login
                loggedInUser={this.state.loggedInUser}
                setLoggedInUser={this.setLoggedInUser}
              />
            )}
          />
        </BrowserRouter>
      </div>
    );
  }
}
