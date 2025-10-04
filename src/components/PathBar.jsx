import Chip from "./Chip";

export default function PathBar({
  path,
  degreeToChord,
  onUndo,
  onClear,
  onJump,
  flashIndex,
  hideActions = false,
}) {
  return (
    <section className="card pathBar">
      <div className="pathRow">
        <div className="labelStrong">Path</div>
        <div className="chips">
          {path.map((deg, i) => (
            <Chip
              key={`${deg}-${i}`}
              active={i === path.length - 1}
              flashing={i === flashIndex}
              onClick={() => onJump(i)}
              data-degree={deg}
            >
              {degreeToChord[deg]} <span className="muted">({deg})</span>
            </Chip>
          ))}
        </div>
        {!hideActions && (
          <>
            <div className="spacer" />
            <button
              className="btn"
              onClick={onUndo}
              disabled={path.length <= 1}
            >
              Undo
            </button>
            <button className="btn" onClick={onClear}>
              Clear
            </button>
          </>
        )}
      </div>
    </section>
  );
}
