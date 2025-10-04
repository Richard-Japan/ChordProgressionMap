import { useState } from "react";
import Chip from "./Chip";

export default function SectionsList({
  sections,
  activeId,
  onSwitch,
  onAddPreset,
  onRename,
  onRemove,
  degreeToChord,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  function startEdit(sec) {
    setEditingId(sec.id);
    setDraft(sec.name);
  }
  function commit() {
    if (editingId) onRename(editingId, draft.trim() || "Untitled");
    setEditingId(null);
    setDraft("");
  }

  return (
    <section className="sectionsList">
      <div className="sectionsHeader">
        <div className="labelStrong">Sections</div>
        <div className="sectionsAdd">
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
          <button className="btnGhost sm" onClick={() => onAddPreset("Outro")}>
            + Outro
          </button>
        </div>
      </div>

      <div className="sectionsStack">
        {sections.map((sec) => {
          const isActive = sec.id === activeId;
          return (
            <div
              key={sec.id}
              className={`sectionCard card ${isActive ? "sectionActive" : ""}`}
            >
              <div className="sectionRow">
                <button
                  className="sectionName"
                  title={isActive ? "Active section" : "Set active"}
                  onClick={() => onSwitch(sec.id)}
                >
                  {editingId === sec.id ? (
                    <input
                      autoFocus
                      className="tabInput"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commit();
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setDraft("");
                        }
                      }}
                    />
                  ) : (
                    <span>
                      {sec.name}
                      {isActive ? " •" : ""}
                    </span>
                  )}
                </button>

                <div className="sectionActions">
                  <button
                    className="btnGhost sm"
                    title="Rename"
                    onClick={() => startEdit(sec)}
                  >
                    ✎
                  </button>
                  <button
                    className="btnGhost sm"
                    title="Remove section"
                    onClick={() => onRemove(sec.id)}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="sectionChips">
                {sec.path.map((deg, i) => (
                  <Chip key={`${sec.id}-${i}`} degree={deg}>
                    {degreeToChord[deg]} <span className="muted">({deg})</span>
                  </Chip>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
