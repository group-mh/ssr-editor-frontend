export default function CommentsList({ comments, onDelete }) {
  return (
    <section className="comments-section">
      <h2>Comments</h2>
      <ul className="comments-list">
        {(!comments || comments.length === 0) && (
          <li className="no-comments">No comments</li>
        )}

        {comments.map((comment) => (
          <li
            key={comment.id}
            id={`comment-${comment.id}`}
            className="comment-item"
          >
            <div>
              <span className="comment-author">{comment.user}</span>{" "}
              <span className="comment-timestamp">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>

            {comment.selectedText && (
              <p className="comment-highlighted-text">
                "<em>{comment.selectedText}</em>"
              </p>
            )}

            <p className="comment-text">{comment.text}</p>

            <button
              onClick={() => onDelete(comment.id)}
              className="delete-comment-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
