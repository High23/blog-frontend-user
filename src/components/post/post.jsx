import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommentForm from '../comment/comment';
import NavBar from '../navbar/navbar';
import './post.css'
import { format } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

function DisplayPosts({posts}) {
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
                        <div>Date posted: {format(new UTCDate(post.date), 'LL/dd/yy KK:mm a')} UTC</div>
                        { post.lastUpdated && <div>Last Updated: {format(new UTCDate(post.lastUpdated), 'LL/dd/yy KK:mm a')} UTC</div> }
                        <div>By {post.author.username}</div>
                    </div>
                )
            })}
        </div>
    )
}

function Post() {
    const token = localStorage.getItem('token');
    const [currentUser, setCurrentUser] = useState(null)
    const params = useParams()
    const [data, setData] = useState({post: undefined, postComments: undefined})
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

        async function fetchCurrentUser() {
            const response = await fetch(import.meta.env.VITE_SITEURL + 'user', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (response.status >= 400) {
                setCurrentUser('no user')
                return;
            }
            const data = await response.json()
            setCurrentUser(data.user)
        }

        if (token !== null || token !== undefined) {
            fetchCurrentUser()
        }
        
        fetchPost()
    }, [refresh])

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
                        <div>Published on: {format(new UTCDate(data.post.date), 'LL/dd/yy KK:mm a')} UTC</div>
                        { data.post.lastUpdated && <div>Last Updated: {format(new UTCDate(data.post.lastUpdated), 'LL/dd/yy KK:mm a')} UTC</div> }
                        <p>{data.post.text}</p>
                    </section>
                    <CommentForm data={data} token={token} setRefresh={setRefresh} setErrors={setErrors} currentUser={currentUser}></CommentForm>
                </>
            }
            { errors !== null && 
            <p>{errors.message}</p>
            }
        </>
    )
}


export { DisplayPosts, Post }