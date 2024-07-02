import { useContext, useEffect, useState } from 'react'
import './user.css'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../navbar/navbar'

export function CurrentUser() {
    const siteUrl = import.meta.env.VITE_SITEURL
    const [currentUser, setCurrentUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'));
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

    return (
        <>
            <NavBar token={token}></NavBar>
            { (currentUser !== null) && 
            <div> 
                <h3>Username: { currentUser.username }</h3>
                <div>Author status: { currentUser.author === false ? "Not an author" : "Is an author" }</div>
                <button type="button" onClick={() => {
                    navigate(`${currentUser._id}/edit`)
                }}>Edit user </button>
            </div>
            }
        </>
    )
}

export function EditCurrentUser() {
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const params = useParams()
    const siteUrl = import.meta.env.VITE_SITEURL + `/user/${params.userId}/edit`;

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const data = `username=${formData.get('username')}&password=${formData.get('password')}&author=${formData.get('authorCheckBox')}`;
        const response = await fetch(siteUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token
            },
            body: data,
        });
        
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
        } else {
            localStorage.setItem('token', info.token);
            navigate("/user", {replace: true});
        }
    }

    return (
        <>
            <NavBar token={token}></NavBar>
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="username">New username: </label>
                    {errors === 'Username does not exist.' && <div>{errors}</div>}
                    <input type="text" name="username" id="username"/>
                </div>
                <div>
                    <label htmlFor="password">New password: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="password" name="password" id="password" autoComplete='off' />
                </div>
                <div>
                    <label htmlFor="authorCheckBox">Author: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="checkbox" name="authorCheckBox" id="authorCheckBox"/>
                </div>
                <button>Save Changes</button>
            </form>
        </>
    )
}

export function User() {
    const token = localStorage.getItem('token');
    return (
        <>
            <NavBar token={token}></NavBar>
            <p>Random user info</p>
        </>
    )
}

export default { CurrentUser, User, EditCurrentUser }