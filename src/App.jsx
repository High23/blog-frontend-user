import { useEffect, useState } from 'react'
import './App.css'
import DisplayPosts from './components/post/post'

export default function App() {
    const [posts, setPosts] = useState(null)
    const [err, setErr] = useState(null)
    useEffect(() => {
        async function fetchPosts() {
            const data = await fetch('https://tourmaline-amenable-quotation.glitch.me/')
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
            <header>posts</header>
            {(err === null && posts !== null) && <DisplayPosts posts={posts}></DisplayPosts>}
        </div>
    )
}
