import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as RoutesWrapper,
  Switch,
  Route,
} from "react-router-dom";
import Config from "./components/Config";
import { bindActionCreators } from "redux";
import * as Actions from "./store/actions";

import Home from "./pages/Home";

const mapStateToProps = state => {

  return {
    ...state
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...Actions }, dispatch);
};

class App extends Component {
  componentDidMount() {

  }
  render() {
    return (
      <RoutesWrapper>
        <Config>
          <Switch>
            <Route
              exact
              path="/"
              component = {Home}
            />
          </Switch>
        </Config>
      </RoutesWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
