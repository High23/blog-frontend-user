import { useState } from 'react'
import './post.css'

export default function DisplayPosts({posts, error}) {
    
    return (
        <div>
            {posts.map((post) => {
                return (
                    <div key={post._id}>
                        <div>{post.title}</div>
                        <div>{post.text}</div>
                        <div>Date Posted: {post.date}</div>
                        <div>Last Updated: {post.lastUpdated}</div>
                        <div>By {post.author.username}</div>
                        <br />
                    </div>
                )
            })}
        </div>
    )
}
