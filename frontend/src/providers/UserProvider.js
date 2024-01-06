import { createContext, useContext, useEffect, useState } from 'react';

const API = 'http://localhost:8000'

const UserContext = createContext();

export default function UserProvider({ children }) {
    const [ user, setUser ] = useState(null)

    useEffect(() => {
        (async () => {

            const token = JSON.parse(localStorage.getItem('accessToken'));
            
            if (token) { //TODO: }) {
                fetch('http://127.0.0.1:8000/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response)=>response.json())
                .then((data)=>{console.log(data); setUser(data)})
            }
            else {
                setUser(null);
            }
        })();
    }, []);

    const login = async (username, password) => {

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
    
        const result = await fetch(
          'http://127.0.0.1:8000/token', {
              method: 'POST',
              body: formData,
          }
        )
        .then(res=>{
            
            if (res.status == 200){
                res.json().then(data => {
                    const token = data.access_token;
                    localStorage.setItem('accessToken', JSON.stringify(token));
                });
            }
        })
        .then(() => {
            const token = JSON.parse(localStorage.getItem('accessToken'));
            return fetch('http://127.0.0.1:8000/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
        })
        .then(res => {
            if (res.status == 200) {
              res.json().then(data => {
                const user = data;
                setUser(user);
              });
            }
          });;
    };

    const logout = async () => {
        // TODO: delete token from server
        setUser(null);
    }
    return (
        <UserContext.Provider value={{user, setUser, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}