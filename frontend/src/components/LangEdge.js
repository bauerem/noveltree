import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

export function LangEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) {
  const [ isExpanded, setIsExpanded ] = useState(false);
  const [ isEditing, setIsEditing ] = useState(false);

   // TODO: Update Emulator on function call
   const post = (event) => {
    const value = event.target.elements.url.value;
    if (isEditing) {
      data.textSetter(value);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
   }

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const expander = () => {
  if (isExpanded) {
    setIsExpanded(false);
  } else {
    setIsExpanded(true);
  }
  }

  // TODO: Refactor: combine editToggler and postUrl
  const editToggler = () => {
  if (isEditing) {
    setIsEditing(false);
  } else {
    setIsEditing(true);
  }
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            {isExpanded && <div style={{width: 200}}></div>}
            {!isExpanded && <button onClick={expander}>{ '+' }</button>}
            {
              isExpanded
              &&
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: 300,
                height: 70,
                backgroundColor: 'white',
                borderRadius: 5,
                border: '1px solid'
              }}>
                <div>
                  <button onClick={expander}>-</button>
                </div>
                <div style={{
                  width: '100vw'
                }}>
                  {
                  isEditing
                  ?
                    <form onSubmit={post}>
                      <input id='url' type='text'></input>
                      <button type='submit'>Submit</button>
                    </form>
                  
                  :
                  <p>{data.text}</p>
                  }
                </div>
                <div style={{
                  display:'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                >
                  {!isEditing && <button onClick={editToggler}>{(data.text && data.text !== '') ? 'Edit' : 'Add text'}</button>}
                </div>
              </div>
            }
          </div>  
        </div>
      </EdgeLabelRenderer>
    </>
  );
}


//<button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>+</button>

