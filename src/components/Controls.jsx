// src/components/Controls.jsx
export default function Controls({
  keyName,
  onChangeKey,
  styleName,
  onChangeStyle,
  majorKeys,
  minorKeys,
  styleNames,
  scaleKind,
  onChangeScaleKind,
}) {
  const keys = scaleKind === "Minor" ? minorKeys : majorKeys;

  return (
    <section className="controls">
      <div className="controlGroup">
        <label className="label">Scale</label>
        <select
          className="select"
          value={scaleKind}
          onChange={(e) => onChangeScaleKind(e.target.value)}
        >
          <option>Major</option>
          <option>Minor</option>
        </select>
      </div>

      <div className="controlGroup">
        <label className="label">Key</label>
        <select
          className="select"
          value={keyName}
          onChange={(e) => onChangeKey(e.target.value)}
        >
          {Array.isArray(keys) &&
            keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
        </select>
      </div>

      <div className="controlGroup">
        <label className="label">Style</label>
        <select
          className="select"
          value={styleName}
          onChange={(e) => onChangeStyle(e.target.value)}
        >
          {Array.isArray(styleNames) &&
            styleNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
        </select>
      </div>
    </section>
  );
}
