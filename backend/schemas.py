from pydantic import BaseModel

## General

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

## NovelTrees

class Node(BaseModel):
    id: str
    position: dict
    data: dict
    type: str
    #{ "id": '1', "position": { "x": 0, "y": 0 }, "data": { "label": '1' } }

class Edge(BaseModel):
    id: str
    source: str
    target: str
    type: str
    data: dict
    #{ "id": 'e1-2', "source": '1', "target": '2' }

class Graph(BaseModel):
    nodes: list[Node]
    edges: list[Edge]

class NovelTree(BaseModel):
    id: str
    name: str
    author: str
    about: str
    graph: Graph