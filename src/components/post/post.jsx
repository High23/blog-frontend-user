import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../navbar/navbar';
import './post.css'

function DisplayPosts({posts, error}) {
    const navigate = useNavigate();
    
    return (
        <div>
            {posts.map((post) => {
                return (
                    <div className='post-card clickable' key={post._id} onClick={() => {
                        navigate(`/post/${post._id}`);
                    }}>
                        <div>{post.title}</div>
                        <div>{post.text}</div>
                        <div>Date Posted: {post.date}</div>
                        <div>Last Updated: {post.lastUpdated}</div>
                        <div>By {post.author.username}</div>
                    </div>
                )
            })}
        </div>
    )
}

function Post() {
    const token = localStorage.getItem('token')
    const params = useParams()
    const [data, setData] = useState({post: undefined, comments: undefined})
    const [refresh, setRefresh] = useState(0)
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchPost() {
            const response = await fetch(import.meta.env.VITE_SITEURL + `post/${params.postId}`, {
                headers: {
                    "Authorization": "Bearer " + token
                },
            })
            const data = await response.json()
            if (response.status >= 500) {
                setErrors({message: "A server error has occurred. It's possible that the url isn't formatted correctly. Sending you back home..."});
                setTimeout(() => {
                    navigate('/', {replace: true});
                }, 5000);
                return;
            } else if (response.status >= 400) {
                setErrors(data)
                return;
            }
            setData(data)
        }
        fetchPost()
    }, [refresh])

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const bodyData = `text=${formData.get('commentText')}`;
        const response = await fetch(import.meta.env.VITE_SITEURL + `post/${data.post._id}/comment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token
            },
            body: bodyData,
        });
        form.target.commentText.value = ''
        if (response.status === 200) {
            setRefresh((num) => num + 1)
            return
        }
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
        } 
    }

    return (
        <>
            <NavBar token={token}></NavBar>
            { data.post !== undefined && 
                <>
                    <section className='post'>
                        <h2>{data.post.title}</h2>
                        <h4 className='username clickable' onClick={() => {
                                navigate(`/user/${data.post.author._id}`);
                            }}>{data.post.author.username}</h4>
                        <div>{data.post.date}</div>
                        <p>{data.post.text}</p>
                    </section>
                    <section>
                        <h2>Comments</h2>
                        <form action="" method="post" onSubmit={(form) => {formSubmission(form)}}>
                            <label htmlFor="commentText"></label>
                            <textarea type="text" name="commentText" id="commentText" cols={40} rows={3} min={2} max={250} required onInvalid={(e) => {
                                e.target.setCustomValidity("A comment must be between 2 and 250 characters long!")
                            }}/>
                            <button>Comment</button>
                        </form>
                    { data.comments.length > 0 && data.comments.map((comment) => {
                        return (
                            <div key={comment._id}>
                                <h4 className='username clickable' onClick={() => {
                                        navigate(`/user/${comment.author._id}`);
                                }}>{comment.author.username}</h4>
                                <div>{comment.date}</div>
                                <p>{comment.text}</p>
                            </div>
                        )
                    })}
                    </section>
                </>
            }
            { errors !== null && 
            <p>{errors.message}</p>
            }
        </>
    )
}

function CreatePost() {
    const token = localStorage.getItem('token')
    return (
        <>
            <NavBar token={token}></NavBar>
            <CreateForm></CreateForm>
        </>
    )
}

function CreateForm() {
    return (
        <form>
            input
        </form>
    )
}

export { DisplayPosts, Post, CreatePost }