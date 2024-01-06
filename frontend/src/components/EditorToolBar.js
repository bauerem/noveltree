
// the ReactFlow docs have some interesting ideas for layouts, see Guide > Layouting Guide 16.08.23
// the ReactFlow docs may have ideas for View and/or for Options/Settings, see Guide > Panning and Zooming

const EditorToolBar = ({ onSave }) => {
    return (
      <header
        style={{background: 'lightgray'}}
      >
        <div
          style={{
            padding: "0.2em",
            
          }}
        >
          <>{/*File*/}
            <button><p>Export</p></button>
            <button onClick={onSave}><p>Save</p></button>
          </>

          <button><p>Layout</p></button>
          <button><p>View</p></button>
          <button><p>Help</p></button>
        </div>
      </header>
    );
}

export default EditorToolBar;