import { useState } from "react";

export default function SectionsMini({
  sections,
  activeId,
  onSwitch,
  onAddPreset,
  onRename,
  onRemove,
  degreeToChord,
}) {
  const [customName, setCustomName] = useState("");

  return (
    <section className="card sectionsMini">
      <div className="sectionsHeader">
        <div className="sectionsTitle">Sections</div>
        <div className="sectionsPresets">
          <button className="btnGhost sm" onClick={() => onAddPreset("Intro")}>
            + Intro
          </button>
          <button className="btnGhost sm" onClick={() => onAddPreset("Verse")}>
            + Verse
          </button>
          <button className="btnGhost sm" onClick={() => onAddPreset("Chorus")}>
            + Chorus
          </button>
          <button className="btnGhost sm" onClick={() => onAddPreset("Bridge")}>
            + Bridge
          </button>
        </div>
      </div>

      <div className="sectionsAddRow">
        <input
          className="select inputStretch"
          placeholder="Add custom section..."
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customName.trim()) {
              onAddPreset(customName.trim());
              setCustomName("");
            }
          }}
        />
        <button
          className="btnPrimary btnAdd"
          onClick={() => {
            if (customName.trim()) {
              onAddPreset(customName.trim());
              setCustomName("");
            }
          }}
        >
          Add
        </button>
      </div>

      <div className="sectionsMiniWrap">
        {sections.map((s) => {
          const seq = s.path.map((d) => degreeToChord[d]).join(" ");
          return (
            <div
              key={s.id}
              className={`sectionsMiniItem ${
                s.id === activeId ? "sectionsMiniItemActive" : ""
              }`}
            >
              <button
                className="sectionsMiniChip"
                onClick={() => onSwitch(s.id)}
              >
                <span className="sectionsMiniName">{s.name}</span>
                <span className="sectionsMiniSeq">{seq}</span>
              </button>
              <div className="sectionsMiniActions">
                <button
                  className="btnGhost sm"
                  onClick={() => {
                    const name = prompt("Rename section", s.name);
                    if (name) onRename(s.id, name);
                  }}
                >
                  Rename
                </button>
                <button
                  className="btnGhost sm danger"
                  onClick={() => onRemove(s.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
