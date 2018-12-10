import React from 'react';

let defaultLoadingComponent = null;

/**
 * Returns a new React component, ready to be instantiated.
 * Note the closure here protecting Component, and providing a unique
 * instance of Component to the static implementation of `load`.
 */
export default function dynamicLoadable({
  component,
  LoadingComponent,
  models: resolveModels,
}) {
  // keep Component in a closure to avoid doing this stuff more than once
  let Component = null;

  return class AsyncRouteComponent extends React.Component {
    /**
     * Static so that you can call load against an uninstantiated version of
     * this component. This should only be called one time outside of the
     * normal render path.
     */
    static async load() {
      let models = typeof resolveModels === 'function' ? resolveModels() : [];
      models = !models ? [] : models;
      if (models.length > 0) await Promise.all([...models]);
      const Com = await component();
      if (Com) {
        Component = Com.default || Com;
      }
    }

    static getInitialProps(ctx) {
      // Need to call the wrapped components getInitialProps if it exists
      if (Component !== null) {
        return Component.getInitialProps ? Component.getInitialProps(ctx) : Promise.resolve(null);
      }
    }

    constructor(props) {
      super(props);
      this.updateState = this.updateState.bind(this);
      this.state = {
        Component,
      };
    }

    componentWillMount() {
      AsyncRouteComponent.load().then(this.updateState);
    }

    updateState() {
      // Only update state if we don't already have a reference to the
      // component, this prevent unnecessary renders.
      if (this.state.Component !== Component) {
        this.setState({
          Component,
        });
      }
    }

    render() {
      const { Component: ComponentFromState } = this.state;
      const Loading = LoadingComponent || defaultLoadingComponent;
      if (ComponentFromState) {
        return <ComponentFromState {...this.props} />;
      }

      if (Loading) {
        return <Loading {...this.props} />;
      }

      return null;
    }
  };
}

dynamicLoadable.setDefaultLoadingComponent = (LoadingComponent) => {
  defaultLoadingComponent = LoadingComponent;
};
