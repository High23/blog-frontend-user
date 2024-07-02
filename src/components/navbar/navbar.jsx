import { useState } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'

export default function NavBar({token}) {
    return (
        <header>
            <Link to='/'>Home</Link>
            { (token === null || token === undefined) ? 
            <>
                <Link to='/login'>Log In</Link>
                <Link to='/sign-up'>Sign Up</Link>
            </> :
            <>
                <Link to='/logout'>Log Out</Link>
                <Link to='/user'>Profile</Link>
            </>
            }
        </header>
    )
}