import React from 'react';
import { Switch, Route, withRouter, matchPath } from 'react-router-dom';
import { loadInitialProps } from './loadInitialProps';

class Controller extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-next-line
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      // save the location so we can render the old screen
      this.setState({
        data: undefined, // unless you want to keep it
      });
      const { data, match, routes, history, location, staticContext, ...rest } = nextProps;
      // eslint-disable-next-line
      loadInitialProps(this.props.routes, nextProps.location.pathname, {
        location: nextProps.location,
        history: nextProps.history,
        ...rest,
      }).then(({ data: newData, match: currentMatch }) => {
        const ismatch = matchPath(window.location.pathname, { path: currentMatch.path });
        if (window.location.pathname === currentMatch.path || (ismatch && ismatch.isExact)) {
          this.setState({ data: newData });
        }
      });
    }
  }

  render() {
    const { data } = this.state;
    const { routes, location, store } = this.props;
    const initialData = data;
    return (
      <Switch>
        {routes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            exact={route.exact}
            location={location}
            render={(props) => {
              return React.createElement(route.component, {
                ...initialData,
                store,
                history: props.history,
                location,
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
