import { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    // authToken: (state.session.currentUser || {}).access,
    // ...ownProps
  };
};

class Config extends Component {
    constructor(props){
        super(props)
        
    }
  render() {
    return this.props.children;
  }
}

export default withRouter(connect(mapStateToProps)(Config));
