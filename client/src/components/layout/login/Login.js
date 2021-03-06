import React from "react";
import axios from "axios";
import "./Login.scss";
import { withRouter } from "react-router-dom";
import { message } from "antd";

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.postUserData();
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  postUserData = () => {
    // Post the user data
    if (!this.state.email || !this.state.password) {
      message.warning("Fill Both fields");
    } else if (this.state.password.length < 6) {
      message.warning("Password must contain 6 letter.");
    } else {
      axios
        .post(`/api/users/login`, this.state)
        .then(res => {
          if (res.data.status === false) {
            message.error(res.data.message);
          } else {
            localStorage.setItem(
              "authToken",
              JSON.stringify(res.data.authToken)
            );
            // TODO: Add logic to render different dashboard
            const authToken = res.data.authToken;
            // console.log(authToken, "con");
            this.props.fetchUser(authToken);
            this.props.history.push("/");
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  render() {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-title">Sign In</h1>
          </div>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              onChange={this.handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
