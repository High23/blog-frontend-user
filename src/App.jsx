import { useEffect, useState } from 'react'
import './App.css';
import DisplayPosts from './components/post/post';
import NavBar from './components/navbar/navbar';

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [posts, setPosts] = useState(null)
    const [err, setErr] = useState(null)
    const siteUrl = import.meta.env.VITE_SITEURL
    useEffect(() => {
        async function fetchPosts() {
            const data = await fetch(siteUrl)
                .then(response => response.json())
                .catch(error => {
                    setErr(error)
                });
            setPosts(data.posts)
        }
        fetchPosts()
        return () => {
            setPosts(null)
        }
    }, [])
    return (
        <div>
            <NavBar token={token}></NavBar>
            {(err === null && posts !== null) && <DisplayPosts posts={posts}></DisplayPosts>}
        </div>
    )
}
