from fastapi import FastAPI, HTTPException, File, UploadFile, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from schemas import Graph, NovelTree, User, UserInDB
from typing import Annotated
from data import data, fake_users_db, image_db
from fastapi.staticfiles import StaticFiles
import aiofiles
from dependencies import get_current_user, oauth2_scheme
from fastapi.security import OAuth2PasswordRequestForm
from dependencies import fake_hash_password
import uuid
import os
from generate import generate

if not os.path.exists("./static"):
    os.makedirs("./static")

app = FastAPI()

origins = [
    "http://localhost:3000",  # Replace with the origin of your JavaScript code
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/trees/{id}")
async def get_tree(id: str) -> Graph:
    return Graph(**data[id]["graph"])

@app.post("/trees/{id}", status_code=201)
async def post_tree(id: str, noveltree: NovelTree) -> NovelTree:
    if id in data:
        raise HTTPException(status_code=409, detail=f"NovelTree with the id {id} already exists.")
    data[id] = noveltree.model_dump()
    return NovelTree(**data[id])

@app.put("/trees/{id}")
async def put_tree(id: str, tree: Graph) -> Graph:
    if id not in data:
        raise HTTPException(status_code=404, detail=f"NovelTree with id {id} not found.")
    ## TODO: Update so that only changes are passed to backend so that editing is real-time.
    data[id]["graph"] = tree.model_dump()
    return Graph(**data[id]["graph"])

@app.get("/trees")
async def get_all_trees() -> dict[str, NovelTree]:
    return data

@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}

@app.post("/uploadfile/")
async def create_upload_file(current_user: Annotated[User, Depends(get_current_user)], file: UploadFile):

    file_location = f"static/{file.filename}"
    async with aiofiles.open(file_location, 'wb') as buffer:
        content = await file.read()  # async read
        await buffer.write(content)  # async write
    db_entry = {"id": str(uuid.uuid4()), "filename": file.filename, "location": file_location, "author": current_user.username}
    image_db.append(db_entry)
    return db_entry

@app.get("/users/me/images")
async def get_authored_images(current_user: Annotated[User, Depends(get_current_user)]):
    user_images = [img for img in image_db if img['author'] == current_user.username]
    return user_images

@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

@app.get("/users/me/portfolio")
async def get_authored_trees(current_user: Annotated[User, Depends(get_current_user)]) -> dict[str, NovelTree]:
    if data.items():
        user_trees = {k: v for k, v in data.items() if v['author'] == current_user.username}
        return user_trees

@app.post("/generate-image/")
async def generate_image( current_user: Annotated[User, Depends(get_current_user)], prompt: Annotated[str, Form()] ) -> dict:
    
    urls = generate(current_user.username)


    for url_ in urls:
        db_entry = {"id": str(uuid.uuid4()), "filename": url_, "location": url_, "author": current_user.username}
        image_db.append(db_entry)

    return {"urls": urls}