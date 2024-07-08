import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

export default function CommentForm({data, formSubmission}) {
    const navigate = useNavigate()
    return (
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
                    <div>{format(new UTCDate(comment.date), 'LL/dd/yy KK:mm a')} UTC</div>
                    <p>{comment.text}</p>
                </div>
            )
        })}
        </section>
    )
}