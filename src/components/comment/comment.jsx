import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';

export default function CommentForm({data, formSubmission}) {
    const navigate = useNavigate()
    return (
        <section>
            <h2>Comments</h2>
            <form action="" method="post" onSubmit={(form) => {formSubmission(form)}}>
                <label htmlFor="commentText"></label>
                <textarea type="text" name="commentText" id="commentText" cols={40} rows={3} minLength={2} maxLength={250} required onInvalid={(e) => {
                    e.target.setCustomValidity("A comment must be between 2 and 250 characters long!")
                }}/>
                <button>Comment</button>
            </form>
        { data.postComments.length > 0 && data.postComments.map((comment) => {
            return (
                <div key={comment._id}>
                    <h4 className='username clickable' onClick={() => {
                            navigate(`/user/${comment.author._id}`);
                    }}>{comment.author.username}</h4>
                    <div>{formatDistanceToNow(comment.date)} ago</div>
                    <p>{comment.text}</p>
                </div>
            )
        })}
        </section>
    )
}