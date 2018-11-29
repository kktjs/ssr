import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      repos: {},
    };
  }
  componentDidMount() {
    fetch('/api/user/19', {
      Accept: 'application/json',
      credentials: 'include',
      'Content-Type': 'application/x-www-form-urlencoded',
    }).then(response => response.json()).then((data) => {
      if (data) {
        this.setState({ ...data });
      }
    });
    // Github API
    fetch('/repos/jaywcjlove/kkt-ssr').then(response => response.json()).then((data) => {
      this.setState({ repos: { ...data } });
    });
  }
  render() {
    return (
      <div className="blue">
        Name: {this.state.username} <br />
        ID: {this.state.id} <br /><br />
        <h3>Load the github API below.</h3>
        <div>
          {this.state.repos.owner && this.state.repos.owner.avatar_url && (
            <img src={this.state.repos.owner.avatar_url} alt="" />
          )}
        </div>
        <div>
          <a href={this.state.repos.html_url}><b>{this.state.repos.full_name}</b></a>
        </div>
        <div>
          <span>Star{this.state.repos.stargazers_count}</span>
        </div>
        <div>
          {this.state.repos.description}
        </div>
      </div>
    );
  }
}
