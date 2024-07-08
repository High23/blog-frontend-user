import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './navbar.css'

export default function NavBar({token}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [errors, setErrors] = useState(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchCurrentUser() {
            const response = await fetch(import.meta.env.VITE_SITEURL + 'user', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const data = await response.json()
            if (response.status !== 200) {
                setErrors("Invalid token!")
                navigate('/logout', {replace: true});
                return;
            }
            setCurrentUser(data.user)
        }

        if (token) {
            fetchCurrentUser()
        }
    }, []);

    return (
        <>
            <header>
                <Link to='/'>Home</Link>
                { (token === null || token === undefined) ? 
                <>
                    <Link to='/login'>Log In</Link>
                    <Link to='/sign-up'>Sign Up</Link>
                </> :
                <>
                    {((errors === undefined && currentUser !== null) && currentUser.author) && <Link to='/post/create'>Create a Post</Link>}
                    <Link to='/logout'>Log Out</Link>
                    <Link to='/user'>Profile</Link>
                </>
                }
            </header>
        </>
        
    )
}