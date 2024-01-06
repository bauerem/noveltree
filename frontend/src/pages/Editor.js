import React, { useEffect, useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, MiniMap, Background } from 'reactflow';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { useNavigate } from "react-router-dom";
import EditorToolBar from '../components/EditorToolBar';
import { EditorDrawer } from '../components/EditorDrawer';
import ImageNode from '../components/ImageNode';
import { initialNodes, initialEdges } from '../utils/initData';
import { LangEdge } from '../components/LangEdge';
import Modal from '../components/Modal';

import EditorTutorial1 from './EditorTutorial/EditorTutorial1';

const Emulator = ({ selectedNode, downStreams, select_node_by_id }) => {
    return (
        <div
            style={{
                padding: '1em'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={ selectedNode.data.imageUrl }
                    alt="Anime eye"
                    style={{
                        width: '25vw',
                        height: '25vw'
                    }}
                />
            </div>
            <div
                style={{
                    width: '25vw',
                    height: '25vw',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                {downStreams.map((edge, key) => (
                    <button
                      key={key}
                      onClick={()=> select_node_by_id(edge.id.split('-')[1])}
                      style={{
                        width: '500px',
                        height: '50px'
                      }}
                    >
                        {edge.data.text}
                    </button>
                ))}
            </div>
        </div> 
    )
}

const nodeTypes = { imageNode : ImageNode };
const edgeTypes = { 'lang-choice' : LangEdge };

function Editor() {

    const [currentOverlay, setCurrentOverlay] = useState(0);

    // Web app state and navigation
    const { id } = useParams();
    const navigate = useNavigate();

    // Graph
    const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);

    // Selected Node
    const [ selectedNode, setSelectedNode ] = useState(initialNodes[0]);
    const [ downStreams, setDownStreams ] = useState([]);

    const updateDownStreams = (node) => {
        console.log(edges)
        const filteredEdges = edges.filter(edge => {
            const [sourceId, targetId] = edge.id.split('-');
            console.log(sourceId)
            return sourceId === `e${node.id}`;
          });
        console.log(filteredEdges.id);
        setDownStreams(filteredEdges)
    }

    const select_node = (node) => {
        const updatedNodes = nodes.map((n) => {
            const isSelected = n.id === node.id;
            if (isSelected) {
                setSelectedNode(node)
                updateDownStreams(node);
            }
            return {
                ...n,
                data: {
                    ...n.data,
                    isSelected
                }
            };
        });
        setNodes(
            updatedNodes
        )
    }

    const select_node_by_id = (id_) => {
        select_node(nodes[id_-1])
    }

    const setNodeImageUrl = useCallback((nodeId, imageUrl) => {
        setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            imageUrl: imageUrl
                        }
                    };
                }
                return node;
            });
            return updatedNodes;
        });
    }, [setNodes]);

    const setEdgeText = useCallback((edgeId, text) => {
        setEdges((prevEdges)=>{
            const updatedEdges = prevEdges.map((edge) => {
                if (edge.id === edgeId) {
                    return {
                        ...edge,
                        data: {
                            ...edge.data,
                            text
                        }
                    }
                }
                return edge;
            })
            return updatedEdges;
        })
    }, [setEdges])

    useEffect(()=> {
        try {
            fetch(`http://127.0.0.1:8000/trees/${id}`)
            .then(response => response.json())
            .then(body => {
                const updatedNodes = body.nodes.map((node) => {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            // Callbacks
                            imageSetter: (url) => setNodeImageUrl(node.id, url)
                        }
                    };
                });
                setNodes(
                updatedNodes
                )
                const updatedEdges = body.edges.map((edge) => {
                    return {
                        ...edge,
                        data: {
                            ...edge.data,
                            // Callbacks
                            textSetter: (text) => setEdgeText(edge.id, text)
                        }
                    }
                })
                setEdges(
                updatedEdges
                )
                return body.nodes;
            })
            .then((nodes)=>{
                nodes.map((node)=>{
                    if (node.data.isSelected) {
                        setSelectedNode(node)
                        updateDownStreams(node);
                    }
                    return 0;
                })
            });
        } catch {
            console.log('fail!');
    }
    }, [setNodes, setNodeImageUrl, setEdges, id]);

    const onConnect = useCallback(
    (params) => {
        const edgeId = 'e' + params.source + params.target.replace("node", "");
        params = {
            ...params,
            'id': `e${params.source}-${params.target.split('-')[1]}`,
            'type': 'lang-choice',
            
            data: {
                text: "",
                // Callbacks
                textSetter: (text) => setEdgeText(edgeId, text)
            }
           
        }
        setEdges(
        (eds) => addEdge(params, eds)
        )
        }, [setEdges]
    );

    const handleSave = () => {
        const updatedNodes = nodes.map((node) => {
            const { data: {
                // Callbacks
                imageSetter: func,
                
                // Rest
                ...node_data_rest}, ...node_rest 
            } = node;
            const new_nodes = {
                ...node_rest,
                data: {
                    ...node_data_rest
                }
            }
            return new_nodes;
        });

        const updatedEdges = edges.map((edge) => {
            const {
                data: {
                    //Callbacks
                    textSetter: func,

                    //Rest
                    ...edge_data_rest}, ...edge_rest
            } = edge;
            const new_edges = {
                ...edge_rest,
                data: {
                    ...edge_data_rest
                }
            }
            return new_edges;
        })

        const data = { nodes: updatedNodes, edges: updatedEdges };

        fetch(`http://127.0.0.1:8000/trees/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then((responseData) => {
                console.log('Save successful:', responseData);
                navigate('/')
            })
            .catch((error) => {
            console.error('Save error:', error);
            });
    };

    const onPaneClick = (event) => {
        const nodeId = 'node-' + (nodes.length + 1); // Generate a new node id
        const newNode = {
            id: nodeId,
            data: {
                label: nodes.length + 1,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Anime_eye.svg/1920px-Anime_eye.svg.png",
                // Callbacks
                imageSetter: (url) => setNodeImageUrl(nodeId, url)
            },
            position: {
                x: event.clientX,
                y: event.clientY
            },
            type: 'imageNode'
    };

    setNodes((els) => els.concat(newNode));
    };

    const onNodeClick = (event, node) => {
        select_node(node);
    };

    return (
    <div style={{ width: '100vw', height: '100vh'}}>
        <EditorToolBar onSave={handleSave}/>
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'row'
        }}>
            <EditorDrawer />
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                edges={edges}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onConnect={onConnect}
                onPaneClick={onPaneClick}
                >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={50} size={3} />
            </ReactFlow>
            <Emulator selectedNode={selectedNode} downStreams={downStreams} select_node_by_id={select_node_by_id}/>
        </div>
        <Modal isOpen={currentOverlay}>
            {currentOverlay === 0 && <EditorTutorial1 />}
        </Modal>
        
    </div>
    );
}

export default Editor;