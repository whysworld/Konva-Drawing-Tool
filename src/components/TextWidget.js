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
          // onChange({
          //   ...shapeProps,
          //   x: node.x(),
          //   y: node.y()
          // });
        }}
        on
        onTransform={e =>{
          const node = shapeRef.current;
          const scaleX = (node.scaleX()).toString();
          const scaleY = (node.scaleY()).toString();
          if (scaleX.slice(0,scaleX.length-2) !== scaleY.slice(0,scaleX.length-2)) {
            onChange(
              {
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                wrap: "char",
                width: node.width() * node.scaleX()/node.scaleY(),
                scaleX11: node.scaleX(),
                scaleY11: node.scaleY()
              },
              node.scaleX(node.scaleY())
            );
          }else{
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
          anchorCornerRadius={5}
          keepRatio={true}
          enabledAnchors={["middle-left", "middle-right", "bottom-right"]}
          resizeEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 8 || newBox.height < 8) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
export default TextWidget;
