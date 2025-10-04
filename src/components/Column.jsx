export default function Column({ title, children, className = "" }) {
  return (
    <div className={`card column ${className}`}>
      <div className="colTitle">{title}</div>
      <div className="colStack">{children}</div>
    </div>
  );
}
