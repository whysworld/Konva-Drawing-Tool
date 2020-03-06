import React, { Component } from "react";
import "./Toolbar.css";
class Toolbar extends Component {
  state = {
    activeTarget: 'text'
  }
  iconClick = (e) => {
    this.props.handleChangeTool(e)
    this.setState({activeTarget: e})
  }
  render() {
    let {activeTarget} =this.state
    return (
      <div className="toolbar">
        <div className={activeTarget === 'text'?"ui-item ui-text active":"ui-item ui-text"} onClick={() => this.iconClick('text')}>
          <i className="fas fa-font"></i>
        </div>
        <div className={activeTarget === 'selection'?"ui-item ui-selection active":"ui-item ui-selection"} onClick={() => this.iconClick('selection')}>
          <i className="far fa-object-ungroup"></i>
        </div>
      </div>
    );
  }
}
export default Toolbar;
