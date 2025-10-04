export default function Node({ label, degree, onClick, active }) {
  const cls = ["node"];
  if (active) cls.push("nodeActive");
  return (
    <button onClick={onClick} className={cls.join(" ")} data-degree={degree}>
      {label}
    </button>
  );
}
