// components/SectionsStrip.jsx
export default function SectionsStrip({
  sections,
  activeId,
  onSwitch,
  degreeToChord,
}) {
  if (!Array.isArray(sections)) return null;

  const makeLabel = (s) => {
    const shown = s.path
      .slice(0, 5)
      .map((d) => degreeToChord[d])
      .join(" ");
    const more = s.path.length > 5 ? " …" : "";
    return `${s.name}: ${shown}${more}`;
  };

  return (
    <section className="sectionsStrip card">
      <div className="sectionsStripHeader">
        <div className="labelStrong">Sections</div>
      </div>
      <div className="sectionsStripScroller">
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              className={`chip chipTight ${isActive ? "chipActive" : ""}`}
              onClick={() => onSwitch(s.id)}
              title={s.path.map((d) => degreeToChord[d]).join(" - ")}
              aria-pressed={isActive}
            >
              <span className="chipDot" aria-hidden />
              <span className="chipText">{makeLabel(s)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
