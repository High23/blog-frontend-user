import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';

export default function CommentForm({data, token, setRefresh, setErrors, currentUser}) {
    const navigate = useNavigate()
    const siteUrl = import.meta.env.VITE_SITEURL

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const response = await fetch(siteUrl + `post/${data.post._id}/comment/create`, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token,
            },
            body: `text=${formData.get('commentText')}`,
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
        <section>
            <h2>Comments</h2>
            <form action="" method="post" onSubmit={(form) => { formSubmission(form) }}>
                <label htmlFor="commentText"></label>
                <textarea type="text" name="commentText" id="commentText" cols={40} rows={3} minLength={2} maxLength={250} required/>
                <button >Comment</button>
            </form>
        { data.postComments.length > 0 && data.postComments.map((comment) => {
            return (
                <div key={comment._id}>
                    <h4 className='username clickable' onClick={() => {
                            navigate(`/user/${comment.author._id}`);
                    }}>{comment.author.username}</h4>
                    { (currentUser !== 'no user' && 
                    (data.post.author._id === currentUser._id 
                        || comment.author._id === currentUser._id)) &&
                    <>
                        <button type="button" onClick={async () => {
                            await fetch(siteUrl + `post/${data.post._id}/comment/${comment._id}/delete`, {
                                method: "DELETE",
                                headers: {
                                    "Authorization": "Bearer " + token
                                }
                            });
                        }}>Delete</button>
                    </>
                    }
                    <div>{formatDistanceToNow(comment.date)} ago</div>
                    <p>{comment.text}</p>
                </div>
            )
        })}
        </section>
    )
}