import React, { Component } from "react";
import spotifyblacklogo from "../images/spotifyblacklogo.png";

export default class Login extends Component {
  state = {
    usernameInputValue: "",
    passwordInputValue: "",
    errorMessage: ""

  }


  handleSubmit = (e) => {
        e.preventDefault()
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.usernameInputValue,
                password: this.state.passwordInputValue
            })
        })
            .then(res => res.json())
            .then(login => {
                if(login.failed){
                    this.setState({ errorMessage: login.message })
                } else {
                    localStorage.setItem('token', login.token)
                    this.props.setLoggedInUser(login.user)
                }
            })
    }

  render() {
    return (
      <div>
        <div>
          <img
            className="spotifyblacklogo"
            src={spotifyblacklogo}
            style={{ width: "200px" }}
          />
        </div>
        <button className="button1" type="submit">
          LOGIN DOWN BELOW
        </button>
        <div>
          <form>
            <div className="box2">
              <div className="container2">
                <span className="icon">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  onChange={e =>
                    this.setState({ usernameInputValue: e.target.value })
                  }
                  type="search"
                  id="search"
                  placeholder="Username"
                />
                {/* <br></br>
                <p>{this.state.errorMessage}</p> */}
              </div>
            </div>

            <div className="box3">
              <div className="container3">
                <span className="icon">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  onChange={e =>
                    this.setState({ passwordInputValue: e.target.value })
                  }
                  type="search"
                  id="search"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              onClick={this.handleSubmit}
              className="button2"
              type="submit"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }
}
