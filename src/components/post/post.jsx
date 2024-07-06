import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CommentForm from '../comment/comment';
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
                    <CommentForm data={data} formSubmission={formSubmission}></CommentForm>
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
    const [error, setError] = useState(null)
    useEffect(() => {
        if (token === null) {
            setError("You do not have a token!")
            return
        }
        async function verifyAuthorStatus() {
            const response = await fetch(import.meta.env.VITE_SITEURL + "post/create", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (response.status === 500) {
                setError("An error has occurred fetching this page. You either do not have access or a valid token!")
            }
        }
        verifyAuthorStatus()
    }, [])

    return (
        <>
            <NavBar token={token}></NavBar>
            {error === null ? 
            <CreateForm token={token}></CreateForm>
            : <>{error}</>}
        </>
    )
}

function CreateForm({token}) {
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const data = `title=${formData.get('postTitle')}&text=${formData.get('postText')}&published=${formData.get('publishCheckBox')}`;
        const response = await fetch(import.meta.env.VITE_SITEURL + "post/create", {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token,
            },
            body: data,
        });
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
            return
        }
        navigate(`/post/${info.postId}`, {replace: true})
    }

    return (
        <>
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="postTitle">Title: </label>
                    {}
                    <input type="text" name="postTitle" id="postTitle" autoComplete='off' />
                </div>
                <div>
                    <label htmlFor="postText">Text: </label>
                    <textarea type="text" name="postText" id="postText" cols={120} rows={30}  />
                </div>
                <div>
                    <label htmlFor="publishCheckBox">Publish: </label>
                    <input type="checkbox" name="publishCheckBox" id="publishCheckBox"/>
                </div>
                <button>Create post</button>
            </form>
            {errors !== null && <PostCreationErrors errors={errors}></PostCreationErrors>}
        </>
    )
}


function PostCreationErrors({errors}) {
    return (
        <div> Post creation error(s):
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

export { DisplayPosts, Post, CreatePost }