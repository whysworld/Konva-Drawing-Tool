import React, { Component } from "react";
import Toolbar from "./../components/Toolbar";
import { Stage, Layer } from "react-konva";
import Rectangle from "../components/Selection";
import TextWidget from "../components/TextWidget";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTool: "text",
      currentSelectedElement: null,

      canDraw: true,

      isDrawing: false,
      isDrawingMode: true,
      isDrawingText: false,
      isEditingText: false,

      isDrawingRectangle: false,
      rectangleMode: false,

      selectedId: null,

      shapes: [],
      shapeIds: []
    };
    this.stageEl = React.createRef();
    this.layerRectEl = React.createRef();
    this.layerTextEl = React.createRef();
  }
  handleChangeTool = e => {
    this.setState({
      activeTool: e
    });
  };
  componentDidMount() {
    this.addRectangle(
      this.stageEl.current.getStage(),
      this.layerRectEl.current
    );
    this.addText(this.stageEl.current.getStage(), this.layerRectEl.current);
  }
  //draw text
  addText = (stage, layer) => {
    stage.on("dblclick", e => {
    });
    stage.on("click touchstart", e => {
      if (this.state.activeTool != "text") {
        return;
      }
      if (!this.state.canDraw) return;
      let pos = stage.getPointerPosition();

      const newShapes = this.state.shapes.slice();

      newShapes.push({
        id: newShapes.length - 1,
        type: "text",
        text: "",
        x: pos.x,
        y: pos.y + 10,
        fontSize: 30,
        scaleX: 1
      });
      let textNode = newShapes[newShapes.length - 1];

      // create textarea and style it
      var textarea = document.createElement("textarea");
      var span = document.createElement("span");
      document.body.appendChild(textarea);
      document.body.appendChild(span);

      textarea.value = textNode.text;
      span.innerHTM = textarea.value;
      span.style.width = "auto";
      span.style.fontSize = "30px";
      span.style.position = "absolute";

      span.style.visibility = "hidden";
      span.style.left = pos.x + "px";

      textarea.style.position = "absolute";
      textarea.style.top = pos.y + "px";
      textarea.style.left = pos.x + "px";
      textarea.style.width = 30 + "px";
      textarea.style.fontSize = textNode.fontSize + "px";
      textarea.style.height = 30 + "px";

      textarea.style.border = "2px soild wheat";
      textarea.style.padding = "5px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = textNode.lineHeight;
      textarea.style.fontFamily = textNode.fontFamily;
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = textNode.align;
      textarea.style.color = textNode.fill;
      var rotation = textNode.rotation;
      var transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }
      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

      textarea.style.transform = transform;

      // reset height
      //   textarea.style.height = "auto";
      // after browsers resized it we can set actual value
      //   textarea.style.height = textarea.scrollHeight + 3 + "px";

      textarea.focus();
      var $this = this;
      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        span.parentNode.removeChild(span);
        window.removeEventListener("click", handleOutsideClick);
        if (textarea.value.length > 0) {
          newShapes[newShapes.length - 1].text = textNode.text;
        } else {
          newShapes.pop();
        }
        // const result = newShapes.filter(item=>item.text.length>0)
        $this.setState({
          shapes: newShapes
        });
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = 30;
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth+10 + "px";
      }

      textarea.addEventListener("keydown", function(e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text = textarea.value;
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });
      textarea.addEventListener("input", function(e) {
        span.innerHTML = textarea.value;
        let width = span.offsetWidth;
        setTextareaWidth(width);
      });

      function handleOutsideClick(e) {
        if (e.target !== textarea) {
          textNode.text = textarea.value;
          newShapes[newShapes.length - 1].text = textarea.value;
          newShapes[newShapes.length - 1].id = newShapes.length - 1;
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
      this.setState({ isDrawingText: true, shapes: newShapes });
      // add a new arrow with with both start and end x,y values the same
      // and set isDrawingArrow to true
    });

    stage.on("mouseup touchend", () => {
      // line to shapes array here
      if (this.state.isDrawingText) {
        this.setState({ isDrawingText: true }, function() {});
      }
    });

    stage.on("start touchmove", (e) => {
      if (this.state.activeTool != "text") {
        return;
      }
    });
  };
  //draw rectangle
  addRectangle = (stage, layer) => {
    stage.on("mousedown touchstart", e => {
      // start rectangle drawing
      if (this.state.activeTool !== "selection") {
        return;
      }
      if (!this.state.canDraw) return;

      let pos = stage.getPointerPosition();

      // add a new rectangle at the mouse position with 0 width and height,
      // and set isDrawingRectangle to true
      const newShapes = this.state.shapes.slice();

      newShapes.push({
        type: "selection",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: "black",
        strokeWidth: 2
      });
      this.setState({ isDrawingRectangle: true, shapes: newShapes });
    });

    stage.on("mouseup touchend", () => {
      // end rectangle drawing
      // if we are drawing a shape, mouse unclick finishes the drawing
      if (this.state.isDrawingRectangle) {
        this.setState({
          isDrawingRectangle: false
        });
        return;
      }
    });

    stage.on("mousemove touchmove", () => {
      if (this.state.activeTool !== "selection") {
        return;
      }
      if (!this.state.canDraw) return;
      // update & draw rect
      let pos = stage.getPointerPosition();

      if (this.state.isDrawingRectangle) {
        const currentShapeIndex = this.state.shapes.length - 1;
        const currShape = this.state.shapes[currentShapeIndex];
        const newWidth = pos.x - currShape.x;
        const newHeight = pos.y - currShape.y;
        const newShapesList = this.state.shapes.slice();
        newShapesList[currentShapeIndex] = {
          type: "selection",
          id: currentShapeIndex,
          x: currShape.x, // keep starting position the same
          y: currShape.y,
          width: newWidth, // new width and height
          height: newHeight,
          fill: "",
          stroke: "black",
          strokeWidth: 2
        };
        this.setState({ shapes: newShapesList });
      }
    });
  };
  render() {
    return (
      <div className="canvas">
        <Toolbar handleChangeTool={this.handleChangeTool}></Toolbar>
        <Stage
          ref={this.stageEl}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={e => {
            // deselect when clicked on empty area
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) {
              this.setState({
                selectedId: null,
                canDraw: this.state.selectedId !== null ? false : true
              });
            }
          }}
        >
          <Layer ref={this.layerRectEl}>
            {this.state.shapes.map((shape, i) => {
              if (shape.type === "selection") {
                return (
                  <Rectangle
                    key={i}
                    shapeProps={shape}
                    isSelected={shape.id === this.state.selectedId}
                    isDrawingMode={this.state.isDrawingMode}
                    onDragging={() => {
                      this.setState({ canDraw: false });
                    }}
                    onMouseDown={() => {
                      this.setState({ canDraw: false });
                    }}
                    onSelect={() => {
                      this.setState({ canDraw: false });
                      this.setState({ selectedId: shape.id });
                    }}
                    onTransform={() => {
                      this.setState({ canDraw: false });
                    }}
                    onChange={newAttrs => {
                      this.setState({ canDraw: true });
                      const rects = this.state.shapes.slice();
                      rects[i] = newAttrs;
                      this.setState({ shapes: rects });
                    }}
                  />
                );
              } else if (shape.type === "text") {
                return (
                  <TextWidget
                    key={i}
                    shapeProps={shape}
                    isSelected={shape.id === this.state.selectedId}
                    onDragStart={() => this.setState({ canDraw: false })}
                    onTransformStart={() => this.setState({ canDraw: false })}
                    onMouseDown={() => this.setState({ canDraw: false })}
                    onSelect={() => {
                      this.setState({ canDraw: false });
                      this.setState({ selectedId: shape.id });
                    }}
                    onDBClick={() => {
                      this.setState({ canDraw: true, isEditingText: true, selectedId: null });
                    }}
                    onChange={newAttrs => {
                      this.setState({ canDraw: true });
                      const shapes = this.state.shapes.slice();
                      shapes[i] = newAttrs;
                      console.log("----new",newAttrs)
                      this.setState({ shapes: shapes });
                    }}
                  />
                );
              }
            })}
          </Layer>
          <Layer ref={this.layerTextEl}></Layer>
        </Stage>
      </div>
    );
  }
}
export default Home;
