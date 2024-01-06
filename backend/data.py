imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Anime_eye.svg/1920px-Anime_eye.svg.png"

data = {
    "0b63daac-8d1e-4cfc-b954-2d63a6fc1633": {
        "id": "0b63daac-8d1e-4cfc-b954-2d63a6fc1633",
        "author": "johndoe",
        "name": "My first NovelTree",
        "about": "This is a novel about my dog billy that is a bit silly",
        "graph": {
            "nodes": [
                { "id": '1', "position": { "x": 0, "y": 0 }, "data": { "label": '1', "imageUrl": imageUrl, "isSelected": True}, "type": "imageNode" },
                { "id": '2', "position": { "x": 0, "y": 100 }, "data": { "label": '2', "imageUrl": imageUrl, "isSelected": False}, "type": "imageNode" },
                { "id": '3', "position": { "x": 0, "y": 200 }, "data": { "label": '3', "imageUrl": imageUrl, "isSelected": False}, "type": "imageNode" }
            ],
            "edges": [
                { "id": 'e1-2', "source": '1', "target": '2', "type": 'lang-choice' , "data": {"text": "hello dog"}},
                { "id": 'e2-3', "source": '2', "target": '3', "type": 'lang-choice' , "data": {"text": ""}}
            ]
        }
    }
}

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

image_db = []