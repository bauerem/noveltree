import React, { useState, useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { useUser } from '../providers/UserProvider';
import { v4 as uuidv4 } from 'uuid';

const initialArgs = {  };

function reducer(state, action) {
    switch (action.type) {
        case 'add': {
            return {
                ...state,
                ...action.data,
              };
        }
        case 'create': {
            const newId = Object.keys(state).length;
            return {
                ...state,
                [newId]: { "name": action.name, "about": action.about } // TODO give do "name": action.name etc.
            };
        }
        default: {
            return state;
        }
    }
  }


function Library() {

    const [ library, dispatch ] = useReducer(reducer, initialArgs);
    const [newName, setNewName] = useState('');
    const [newAbout, setNewAbout] = useState('');


    const { user } = useUser();

    useEffect(()=>{
        const token = JSON.parse(localStorage.getItem('accessToken'));
        fetch(`http://127.0.0.1:8000/users/me/portfolio`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'add', data });
            })
            .catch(() => {
                console.log('fail!');
            });
    }, []);

    const handleCreate = () => {
        const tree_id = uuidv4();
        fetch(`http://127.0.0.1:8000/trees/${tree_id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: tree_id,
                name: newName,
                author: user.username,
                about: newAbout,
                graph: {
                    nodes: [{ id: '1', position: { x: 0, y: 0 }, data: { label: '1', imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Anime_eye.svg/1920px-Anime_eye.svg.png" }, type: "imageNode"}],
                    edges: []
                }
            }),
        })
        .then(response => response.json())
        .then(()=>{
            dispatch({ type: 'create', name: newName, about: newAbout });
            setNewName('');
            setNewAbout('');
        })
        .catch(()=>{
            console.log('fail!');
        });
    };

    return (
    <div style={{ width: '100vw', height: '100vh'}}>
        <h1>Welcome to NovelTree!</h1>

        <div>
            <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            />
            <input
            type="text"
            placeholder="About"
            value={newAbout}
            onChange={e => setNewAbout(e.target.value)}
            />
            <button onClick={handleCreate}>Create Object</button>
        </div>

        <ul>
            {
                Object.keys(library).map(id => (
                    <li key={id}>
                        <strong>Name:</strong> {library[id].name}
                        <br />
                        <strong>About:</strong> {library[id].about}
                        <br />
                        <Link to={`/viewer/${library[id].id}`}>View</Link>
                        <br />
                        <Link to={`/editor/${library[id].id}`}>Edit</Link>
                    </li>
                ))
            }
        </ul>
    </div>
    );
}

export default Library;