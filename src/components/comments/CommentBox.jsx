export default function CommentBox({
  visible,
  position,
  value,
  onChange,
  onAdd,
}) {
  if (!visible) return null;

  return (
    <div
      className="comment-Box"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
      }}
    >
      <textarea
        placeholder="Write a comment"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onAdd}>Add Comment</button>
    </div>
  );
}
