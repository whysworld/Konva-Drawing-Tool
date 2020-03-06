import React from "react";
import { Text, Transformer } from "react-konva";

const TextWidget = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onMouseDown,
  onDragStart,
  onTransformStart,
  onDBClick
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        text="Text!"
        fontSize={30}
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDblClick={e =>{
         onDBClick({
           ...shapeProps,
           x: e.target.x(),
           y: e.target.y(),
         })
        }}
        onMouseDown={onMouseDown}
        onDragStart={onDragStart}
        onTransformStart={onTransformStart}
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransform={e =>{
          const node = shapeRef.current;
          const scaleX = (node.scaleX()).toString();
          const scaleY = (node.scaleY()).toString();
          console.log(scaleX, scaleY);
          console.log("eee",e);
          if (scaleX.slice(0,scaleX.length-2) !== scaleY.slice(0,scaleX.length-2)) {
            console.log("here is not");
            onChange(
              {
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                wrap: "char",
                width: node.width() * node.scaleX()/node.scaleY(),
              },
              node.scaleX(node.scaleY())
            );
          }else{
            console.log("here is yes");
            onChange(
              {
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                scaleX: node.scaleX(),
                scaleY: node.scaleY(),
                wrap: "char",
              }, 
            );
          }
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = (node.scaleX()).toString();
          const scaleY = (node.scaleY()).toString();
          console.log(scaleX, scaleY);
          console.log("eee",e);
          if (scaleX.slice(0,scaleX.length-2) !== scaleY.slice(0,scaleX.length-2)) {
            console.log("here is not");
            onChange(
              {
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                wrap: "char",
                width: node.width() * node.scaleX()/node.scaleY(),
              },
              node.scaleX(node.scaleY())
            );
          }else{
            console.log("here is yes");
            onChange(
              {
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                scaleX: node.scaleX(),
                scaleY: node.scaleY(),
                wrap: "char",
              }, 
            );
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right", "bottom-right"]}
          resizeEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
export default TextWidget;
