var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var Home = require('./components/Home.jsx');
var Dashboard = require('./components/home/Dashboard.jsx');
var LatestTickDetail = require('./components/home/LatestTickDetail.jsx');
var { Navigation } = require('react-router');

import './store';
import './actions';
import './theme';

var App = React.createClass({

  mixins: [ Router.State , Navigation],

  render () {

    return (
        <RouteHandler/>
    )
  }
});

var routes = (
    <Route path="/" handler={App}>
    	<DefaultRoute name="home" handler={Home}/>
        <Route name="dashboard" path="dashboard/:id/" handler={Dashboard}/>
        <Route name="latestTickDetail" path="lastestTickDetail/:id" handler={LatestTickDetail}/>
    </Route>
);

Router.run(routes, Router.HashLocation, function (Root) {  
  React.render(<Root/>, document.body);
});