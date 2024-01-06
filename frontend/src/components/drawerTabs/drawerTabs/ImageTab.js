import { useEffect, useState } from "react";

const COLOR_ON = 'white';

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

export const ImageTab = () => {

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

    const handleDragStart = (event, imageUrl) => {
        event.dataTransfer.setData('text/plain', imageUrl);
    }

    const generateImage = (event) => {
        event.preventDefault();


        const formData = new FormData();
        formData.append('prompt', event.target.prompt.value);

        const token = JSON.parse(localStorage.getItem('accessToken'));

        fetch(`http://127.0.0.1:8000/generate-image/`, {
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
                console.log('Generation successful:', responseData);

            })
            .then(updateImageList)
            .catch((error) => {
                console.error('Generation error:', error);
            });
    }

    return (
        <Wrapper>
            <h1>Images</h1>
            <h2>Quick Prompt</h2>
            <form onSubmit={generateImage}>
                <input name="prompt" type="text"/>
                <button type="submit">Generate</button>
            </form>
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
                    alt=''
                    key={id}
                    style={{
                        width: '10vw',
                        height: '10vw',
                    }}
                    src={'http://localhost:8000/' + imgList[id].location}
                    draggable="true"
                    onDragStart={(event) => handleDragStart(event, 'http://localhost:8000/' + imgList[id].location)}
                    />
                ))
            }
        </Wrapper>
    )
}