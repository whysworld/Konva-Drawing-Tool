import React from "react";
import { Rect, Transformer } from "react-konva";
// import Konva from "konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, onDragging, onTransform, onMouseDown }) => {
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
        <Rect
        onMouseDown={onMouseDown}
          onClick={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={e => {
            // onChange({
            //   ...shapeProps,
            //   x: e.target.x(),
            //   y: e.target.y()
            // });
          }}
          onDragStart={e =>{
            onDragging({
                ...shapeProps,
              });
          }}
          onTransformStart={e => {
              onTransform({
                ...shapeProps,
              })
          }}
          onTransformEnd={e => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
  
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY)
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            anchorCornerRadius={5}
            enabledAnchors={['middle-left', 'middle-right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </React.Fragment>
    );
  };
  export default Rectangle;