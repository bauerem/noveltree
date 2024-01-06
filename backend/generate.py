import base64
import requests
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

key = os.getenv("STABILITY_API_KEY")

url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

body = {
  "steps": 10,
  "width": 1024,
  "height": 1024,
  "seed": 0,
  "cfg_scale": 5,
  "samples": 1,
  "text_prompts": [
    {
      "text": "catman",
      "weight": 1
    },
    {
      "text": "blurry, bad",
      "weight": -1
    }
  ],
}

headers = {
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": f"Bearer {key}",
}

def generate(username):
    response = requests.post(
    url,
    headers=headers,
    json=body,
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()

    # make sure the out directory exists
    if not os.path.exists("./static"):
        os.makedirs("./static")

    urls = []

    for i, image in enumerate(data["artifacts"]):
        url_ = f'./static/txt2img_{username}_{uuid.uuid4()}.png'
        with open(url_, "wb") as f:
            f.write(base64.b64decode(image["base64"]))
        urls.append(url_)
    
    return urls