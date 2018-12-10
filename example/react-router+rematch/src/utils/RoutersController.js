import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { loadInitialProps } from './loadInitialProps';

class Controller extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      const { data, match, routes, history, location, staticContext, ...rest } = nextProps;
      loadInitialProps(this.props.routes, nextProps.location.pathname, {
        location: nextProps.location,
        history: nextProps.history,
        ...rest,
      }).then(({ data: newData }) => {
        this.setState({ data: newData });
      });
    }
  }
  render() {
    const { data } = this.state;
    const { routes, location } = this.props;
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
