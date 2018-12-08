import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
// import { loadInitialProps } from './loadInitialProps';

class Controller extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      previousLocation: null,
    };
    this.prefetcherCache = {};
  }
  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      this.setState({
        previousLocation: this.props.location,
      });
    }
  }
  render() {
    const { previousLocation, data } = this.state;
    const { routes, location } = this.props;
    const initialData = data;
    return (
      <Switch>
        {Object.keys(routes).map((path, idx) => (
          <Route
            path={path}
            exact={routes[path].exact}
            key={idx}
            location={previousLocation || location}
            render={(props) => {
              return React.createElement(routes[path].component, {
                ...initialData,
                history: props.history,
                location: previousLocation || location,
                match: props.match,
              });
            }}
          />
        ))}
      </Switch>
    );
  }
}

export default withRouter(Controller);
