export default function Chip({ children, degree, active, flashing, onClick }) {
  const cls = ["chip"];
  if (active) cls.push("chipActive");
  if (flashing) cls.push("chipFlash");
  return (
    <button onClick={onClick} className={cls.join(" ")} data-degree={degree}>
      {children}
    </button>
  );
}
