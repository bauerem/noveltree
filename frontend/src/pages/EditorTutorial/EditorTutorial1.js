import React from 'react'

function EditorTutorial1() {
  return (
    <div style={{textAlign: 'center'}}>
        <h1>Welcome to the NovelTree Editor!</h1>
        <p>
            The idea behind NovelTree is most visible in our editor. <br/>
            While the viewer of a NovelTree navigates through scenes by their decisions <br />
            The developer connects scenes with the decisions they predefine. <br />
            In the editor, the scenes are visualized by nodes of a graph, <br />
            while decisions are visualized by the edges connecting the nodes of the graph.
        </p>
        <div style={{
            width: '100vw',
            display: 'flex',
            justifyContent: 'space-evenly'
        }}>
            <button style={{width: 60, height: 40, margin: 30}}>Next</button>
            <button  style={{width: 60, height: 40, margin: 30}}>Skip</button>
        </div>
    </div>
  )
}

export default EditorTutorial1