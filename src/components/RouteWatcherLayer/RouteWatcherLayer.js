import React from 'react';
import PropTypes from 'prop-types';
import { RouteWatcher } from '../../utils';

class RouteWatcherLayer extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object,
    handler: PropTypes.func,
  };

  static defaultProps = {
    routes: {},
    handler: Function.prototype,
  };

  constructor(props) {
    super(props);

    this.state = {
      watcher: null,
    };
  }

  startRouteWatcher() {
    const { store, routes, handler, onUpdate } = this.props;
    const watcher = new RouteWatcher(routes, store, true);

    watcher.start(handler(store));

    this.setState({
      watcher,
    });

    return onUpdate(watcher);
  }

  stopRouteWatcher = () => {
    const { onUpdate } = this.props;
    const { watcher } = this.state;

    watcher?.stop();

    this.setState({
      watcher: null,
    });

    return onUpdate(null);
  };

  componentDidMount() {
    this.startRouteWatcher();
  }

  componentWillUnmount() {
    this.stopRouteWatcher();
  }

  render() {
    return this.props.children;
  }
}

export default RouteWatcherLayer;
