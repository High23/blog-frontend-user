import { Link } from 'react-router-dom'
import './navbar.css'

export default function NavBar({token}) {
    return (
        <header>
            <Link to='/'>Home</Link>
            <Link to='/login'>Log In</Link>
            <Link to='/sign-up'>Sign Up</Link>
        </header>
    )
}

