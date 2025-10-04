export default function AllChordsBar({ degreeToChord, degrees, onStep }) {
  if (!degreeToChord) return null;
  return (
    <section className="allChordsBar card">
      <div className="labelStrong" style={{ marginBottom: 6 }}>
        All chords
      </div>
      <div className="allChordsWrap">
        {degrees.map((deg) => (
          <button
            key={deg}
            className="node nodeSm"
            data-degree={deg}
            title={`${degreeToChord[deg]} (${deg})`}
            onClick={() => onStep(deg)}
          >
            <span className="nodeMain">{degreeToChord[deg]}</span>
            <span className="nodeSub">{deg}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
