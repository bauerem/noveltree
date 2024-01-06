import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';



function ImageNode({ data, isConnectable }) {


   const [ isExpanded, setIsExpanded ] = useState(true);
   const [ isEditing, setIsEditing ] = useState(false);

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

   // TODO: Update Emulator on function call
   const postUrl = (event) => {
    const value = event.target.elements.url.value;
    if (isEditing) {
      data.imageSetter(value);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
   }

  return (
    <div style={{
      height: isExpanded ? '120px' : '20px',
      minWidth: '100px',
      border: data.isSelected ? '2px solid #e74c3c' : '1px solid',
      padding: '5px',
      borderRadius: '5px',
      background: 'white',
    }}>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable}/>
        
        <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              {data.label}
              <button onClick={expander}>{ isExpanded ? '^' : '-'}</button>
            </div>
            {
              isExpanded
              &&
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img
                  src={data.imageUrl}
                  alt="Anime eye"
                  style={{
                    width: '80px',
                    height: '80px'
                  }}
                />
                {
                  isEditing
                  ?
                  <div>
                    <form onSubmit={postUrl}>
                      <input id='url' type='text'></input>
                      <button type='submit'>Submit</button>
                    </form>
                  </div>
                  :
                  <button onClick={editToggler}>edit</button>
                }
              </div>
            }
        </div>
        
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable}/>

    </div>
  )
}

export default ImageNode;