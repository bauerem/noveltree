import { useState } from "react";
import { BsCardImage, BsChatRightText, BsSoundwave } from "react-icons/bs";
import { LuFolderTree } from "react-icons/lu";
import { TbBinaryTree } from "react-icons/tb";

import { ImageTab } from "./drawerTabs/ImageTab";

const COLOR_ON = 'white';
const COLOR_OFF = 'lightgray';


const Switch = ({ mode }) => {

    const Wrapper = ({children}) => (
        <div
            style={{
                margin: "1em",
                background: COLOR_ON
            }}
        >
            {children}
        </div>
    )

    switch (mode) {
        case 'tab-2':
            return (
                <Wrapper>
                    <h1>Lang Prompt</h1>
                    <h2>Quick Prompt</h2>
                    <input></input>
                    <button>Generate</button>
                    <br/>
                    <button>Open advanced prompting</button>
                </Wrapper>
            )
        case 'tab-3':
            return (
                <ImageTab />
            )
        case 'tab-4':
            return (
                <Wrapper>
                    <h1>Sound Prompt</h1>
                    <h2>Quick Prompt</h2>
                    <input></input>
                    <button>Generate</button>
                    <br/>
                    <button>Open advanced prompting</button>
                </Wrapper>
            )
        case 'tab-5':
            return (
                <Wrapper>
                    <h1>Context</h1>
                    <h2>About</h2>
                    <input />
                    <br/>
                    <button>Save</button>
                </Wrapper>
            )
        case 'tab-6':
            return (
                <Wrapper>
                    <h1>Concepts</h1>
                    <h2>About</h2>
                    <input />
                    <h2>Documents</h2>
                    <input />
                    <h2>Sprites</h2>
                    <input />
                    <br/>
                    <button>Save</button>
                </Wrapper>
            )
        default:
            return (
                <h1>Chapters</h1>
            )
    }
}

const Tabs = ({ editMode, setEditMode }) => {

    const buttonStyle = (tab) => ({
        background: editMode === tab ? COLOR_ON : COLOR_OFF,
        border: "none"
    })

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <button
                onClick={()=>{setEditMode('tab-1')}}
                style={buttonStyle('tab-1')}
            >
                <LuFolderTree size={40}/>
            </button>
            <button
                onClick={()=>{setEditMode('tab-5')}}
                style={buttonStyle('tab-5')}
            >
                <TbBinaryTree size={40} />
            </button>
            <button
                onClick={()=>{setEditMode('tab-2')}}
                style={buttonStyle('tab-2')}
            >
                <BsChatRightText size={40} />
            </button>
            <button 
                onClick={()=>{setEditMode('tab-3')}}
                style={buttonStyle('tab-3')}
            >
                <BsCardImage size={40}/>
            </button>
            <button
                onClick={()=>{setEditMode('tab-4')}}
                style={buttonStyle('tab-4')}
            >
                <BsSoundwave size={40} />
            </button>
            <div style={{background: COLOR_OFF, height: '100vh'}}/>
        </div>
    )
}

export function EditorDrawer() {

    const [ editMode, setEditMode ] = useState('tab-1');
  
    return (
        <div style={{
            width: '20vw',
            height: '100vh',
            display: 'flex',
        }}>
            <Tabs editMode={editMode} setEditMode={setEditMode}/>
            <Switch mode={editMode}/>
        </div>
    )
  }