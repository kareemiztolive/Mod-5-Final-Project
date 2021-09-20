import React, { Component } from "react";
import SpotifyIndex from "./components/SpotifyIndex";
import "./App.css";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import DeluxeEdition from "./components/DeluxeEdition";


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
         path="/">

         <Redirect to="/playlist" />

         </Route>
        
       

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
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/deluxeedition" component={DeluxeEdition} />
          <Route
            exact
            path="/deluxeedition/:access_token"
            component={props => <SpotifyIndex {...props} />}
          />
        </BrowserRouter>
      </div>
    );
  }
}
