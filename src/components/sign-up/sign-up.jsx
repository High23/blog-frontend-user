import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/navbar'
import './sign-up.css'

export default function SignUp() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        if (token !== null) {
            navigate("/login", {replace: true});
        }
    })
    
    return (
        <>
            <NavBar token={token}></NavBar>
            {token === null && <SignUpForm navigate={navigate}></SignUpForm>}
        </>
    )
}

function SignUpForm({navigate}) {
    const [errors, setErrors] = useState(null);

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const data = `username=${formData.get('username')}&password=${formData.get('password')}&confirmPassword=${formData.get('confirmPassword')}&author=${formData.get('authorCheckBox')}`;
        console.log(data)
        const response = await fetch(import.meta.env.VITE_SITEURL + 'sign-up', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data,
        });
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
            return
        } 
        navigate("/login", {replace: true});
    }
    
    return (
        <>
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="username">Username: </label>
                    {errors === 'Username does not exist.' && <div>{errors}</div>}
                    <input type="text" name="username"  id="username"/>
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="password" name="password" id="password" autoComplete='off' />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm password: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="password" name="confirmPassword" id="confirmPassword" autoComplete='off' />
                </div>
                <div>
                    <label htmlFor="authorCheckBox">Author: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="checkbox" name="authorCheckBox" id="authorCheckBox"/>
                </div>
                <button>Log In</button>
            </form>
            {errors !== null && <SignUpErrors errors={errors}></SignUpErrors>}
        </>
    )
}

function SignUpErrors({errors}) {
    return (
        <div> Errors:
            {errors.map((err, index) => {
                return (
                    <div key={index}>
                        <span>{err.msg}</span>
                    </div>
                )
            })}
        </div>
    )
}
