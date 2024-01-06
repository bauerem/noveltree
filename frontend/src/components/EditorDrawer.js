import { useEffect, useState } from "react";
import { BsCardImage, BsChatRightText, BsSoundwave } from "react-icons/bs";
import { LuFolderTree } from "react-icons/lu";
import { TbBinaryTree } from "react-icons/tb";

const COLOR_ON = 'white';
const COLOR_OFF = 'lightgray';


const Switch = ({ mode }) => {

    const [ imgList, setImgList ] = useState(null);

    const updateImageList = () => {
        const token = JSON.parse(localStorage.getItem('accessToken'));

        fetch(`http://127.0.0.1:8000/users/me/images`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setImgList(data)
            })
            .catch((error) => {
                console.error('Error retrieving images', error);
            });
    }

    useEffect(()=>{
        updateImageList();
    }, []);

    const uploadImages = (event) => {

        event.preventDefault();

        const formData = new FormData(event.target);

        const token = JSON.parse(localStorage.getItem('accessToken'));

        fetch(`http://127.0.0.1:8000/uploadfile/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then((responseData) => {
                console.log('Upload successful:', responseData);
            })
            .then(updateImageList)
            .catch((error) => {
                console.error('Upload error:', error);
            });
    }

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
                <Wrapper>
                    <h1>Images</h1>
                    <h2>Quick Prompt</h2>
                    <input></input>
                    <button>Generate</button>
                    <br/>
                    <button>Open advanced prompting</button>
                    <h2>Previous Prompts</h2>
                    <p>Loading files...</p>
                    <h2>Library</h2>
                    <form onSubmit={uploadImages}>
                        <input name="file" type="file" multiple />
                        <button type="submit">Submit</button>
                    </form>
                    {
                        imgList === null
                        ?
                        <p>Loading files...</p>
                        :
                        Object.keys(imgList).map(id=>(
                            <img
                            key={id}
                            style={{
                                width: '50px',
                                height: '50px',
                            }}
                            src={'http://localhost:8000/' + imgList[id].location}
                            />
                        ))
                    }
                </Wrapper>
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