import { useEffect, useState } from "react";

export default function PlaylistDrawer({
  open,
  onClose,
  onSave,
  onLoadById,
  onDeleteById,
  listProvider,
}) {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);

  const refresh = () => setList(listProvider?.() || []);
  useEffect(() => {
    refresh();
  }, [open]); // 開いたタイミングで更新

  const handleSave = () => {
    const n = name.trim();
    if (!n) return;
    onSave(n);
    setName("");
    refresh();
  };

  return (
    <>
      {open && <div className="drawerBackdrop" onClick={onClose} />}
      <aside className={`drawer ${open ? "drawerOpen" : ""}`}>
        <div className="drawerHeader">
          <div className="labelStrong">My Playlists</div>
          <button className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="playlistRow" style={{ marginBottom: 10 }}>
          <input
            className="select inputStretch"
            placeholder="New playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSave() : null)}
          />
          <button className="btnPrimary" onClick={handleSave}>
            Save
          </button>
        </div>

        <ul className="listReset">
          {list.map((p) => (
            <li key={p.id} className="playlistItem card">
              <div className="playlistName" title={p.name}>
                {p.name}
              </div>
              <button
                className="btnGhost"
                onClick={() => {
                  onLoadById(p.id);
                  onClose();
                }}
              >
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
      </aside>
    </>
  );
}
