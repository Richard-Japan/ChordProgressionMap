import { useEffect, useState } from "react";

export default function PlaylistBar({
  onSave,
  onLoadById,
  onDeleteById,
  listProvider,
}) {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(true);

  const refresh = () =>
    setList(Array.isArray(listProvider?.()) ? listProvider() : []);
  useEffect(() => {
    refresh();
  }, []);

  const handleSave = () => {
    const n = name.trim();
    if (!n) return;
    onSave(n);
    setName("");
    refresh();
  };

  return (
    <section className="card playlistBar">
      <div className="playlistHeader">
        <button
          className="collapseBtn"
          aria-label={open ? "Collapse" : "Expand"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`collapseIcon ${open ? "open" : ""}`}>▶</span>
        </button>
        <div className="labelStrong">My Playlists</div>
        <div className="spacer" />
      </div>

      <div className={`collapseBody ${open ? "isOpen" : ""}`}>
        <div className="playlistRow" style={{ marginBottom: 10 }}>
          <input
            className="select inputStretch"
            placeholder="Playlist name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <button
            className="btnPrimary"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>

        {list.length === 0 ? (
          <div className="muted" style={{ padding: "6px 2px" }}>
            No playlists yet
          </div>
        ) : (
          <ul className="listReset">
            {list.map((p) => (
              <li key={p.id} className="playlistItem">
                <div className="playlistName" title={p.name}>
                  {p.name}
                </div>
                <button className="btnGhost" onClick={() => onLoadById(p.id)}>
                  Load
                </button>
                <button
                  className="btnGhost danger"
                  onClick={() => {
                    onDeleteById(p.id);
                    refresh();
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
