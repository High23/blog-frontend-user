import { useContext, useEffect, useState } from 'react'
import './user.css'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../navbar/navbar'

export function CurrentUser() {
    const siteUrl = 'https://tourmaline-amenable-quotation.glitch.me/'
    const [currentUser, setCurrentUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'));
    const params = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        if (token === null) {
            throw new Error('You can not access this page');
        }
        async function fetchCurrentUser() {
            const response = await fetch(siteUrl + 'user', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const data = await response.json()
            setCurrentUser(data.user)
        }
        fetchCurrentUser()
    }, [token]);
    console.log(currentUser)
    // maybe use params here instead of outlet
    return (
        <>
            <NavBar></NavBar>
            { (currentUser !== null && params.params === undefined) && 
            <div> 
                <h3>Username: { currentUser.username }</h3>
                <div>Author status: { currentUser.author === false ? "Not an author" : "Is an author" }</div>
                <button type="button" onClick={() => {
                    navigate("edit")
                }}>Edit user </button>
            </div>
            }
        </>
    )
}

export function EditCurrentUser() {
    
    return (
        <>
            <NavBar></NavBar>
        </>
    )
}

export function User() {
    
    return (
        <>
            <NavBar></NavBar>
            <p>Random user info</p>
        </>
    )
}

export default { CurrentUser, User, EditCurrentUser }