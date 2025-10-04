import { useEffect, useMemo, useState, useRef } from "react";
import Controls from "./components/Controls";
import PathBar from "./components/PathBar";
import Column from "./components/Column";
import Node from "./components/Node";
import SectionsStrip from "./components/SectionsStrip.jsx";
import SectionsMini from "./components/SectionsMini.jsx";
import PlaylistDrawer from "./components/PlaylistDrawer.jsx";
import PlaylistBar from "./components/PlaylistBar.jsx";
import AllChordsBar from "./components/AllChordsBar.jsx";
import "./styles.css";

const styleGenre = {
  Pop: {
    I: ["IV", "V", "vi", "ii", "iii", "vii°"],
    ii: ["V", "vii°", "IV", "ii"],
    iii: ["vi", "IV", "ii", "V"],
    IV: ["I", "ii", "V", "vii°"],
    V: ["I", "vi", "iii", "V"],
    vi: ["ii", "IV", "V", "iii"],
    "vii°": ["I", "iii", "V"],
  },
  Jazz: {
    I: ["ii", "IV", "vi"],
    ii: ["V"],
    iii: ["vi", "ii"],
    IV: ["ii", "V", "I"],
    V: ["I", "vi"],
    vi: ["ii", "IV"],
    "vii°": ["I", "iii", "V"],
  },
  Circle: {
    I: ["IV", "ii", "V"],
    ii: ["V", "vii°"],
    iii: ["vi"],
    IV: ["ii", "V"],
    V: ["I"],
    vi: ["ii", "IV"],
    "vii°": ["I", "V"],
  },
  Ballad50s: {
    I: ["vi", "IV", "V"],
    ii: ["V", "IV"],
    iii: ["vi"],
    IV: ["V", "ii", "I"],
    V: ["I"],
    vi: ["IV", "ii"],
    "vii°": ["I"],
  },
  Rock: {
    I: ["IV", "V", "vi"],
    ii: ["V", "IV"],
    iii: ["vi", "IV"],
    IV: ["I", "V", "vi"],
    V: ["I", "IV"],
    vi: ["IV", "V"],
    "vii°": ["I"],
  },
  Metal: {
    I: ["V", "vi", "iii"],
    ii: ["V"],
    iii: ["vi", "V"],
    IV: ["V", "ii"],
    V: ["I", "vi"],
    vi: ["IV", "V", "iii"],
    "vii°": ["I", "V"],
  },
  Blues: {
    I: ["IV", "V"],
    ii: ["V"],
    iii: ["vi"],
    IV: ["I", "V"],
    V: ["IV", "I"],
    vi: ["IV"],
    "vii°": ["I"],
  },
  FunkRNB: {
    I: ["vi", "ii", "V"],
    ii: ["V", "I"],
    iii: ["vi", "ii"],
    IV: ["ii", "V", "I"],
    V: ["I", "vi"],
    vi: ["ii", "IV", "V"],
    "vii°": ["I", "iii"],
  },
};

const chordsByKey = {
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  Eb: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  Ab: ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  Db: ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  Gb: ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"],
  B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
};

const styleNames = Object.keys(styleGenre);
const majorKeys = Object.keys(chordsByKey);
const degrees = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const minorDegrees = ["i", "ii°", "III", "iv", "v", "VI", "VII"];
const minorKeys = minorFromMajor(chordsByKey);

function minorFromMajor(majorDict) {
  const out = {};
  for (const chords of Object.values(majorDict)) {
    const minorKeyName = chords[5];
    const triads = [
      chords[5],
      chords[6],
      chords[0],
      chords[1],
      chords[2],
      chords[3],
      chords[4],
    ];
    out[minorKeyName] = triads;
  }
  return out;
}

const majorToMinor = {
  I: "i",
  ii: "ii°",
  iii: "III",
  IV: "iv",
  V: "v",
  vi: "VI",
  "vii°": "VII",
};
function makeMinorRules(majorRules) {
  const out = {};
  for (const [from, tos] of Object.entries(majorRules)) {
    const fm = majorToMinor[from];
    out[fm] = (tos || []).map((t) => majorToMinor[t]);
  }
  return out;
}
const styleGenreMinor = Object.fromEntries(
  Object.entries(styleGenre).map(([name, rules]) => [
    name,
    makeMinorRules(rules),
  ])
);

function useKeyMap(tonic, isMinor) {
  return useMemo(() => {
    const dict = isMinor ? minorKeys : chordsByKey;
    const degreeList = isMinor ? minorDegrees : degrees;
    const fallback = isMinor ? minorKeys["Am"] : chordsByKey["C"];
    const chords = dict[tonic] || fallback;
    return Object.fromEntries(degreeList.map((deg, i) => [deg, chords[i]]));
  }, [tonic, isMinor]);
}

export default function App() {
  const [scaleKind, setScaleKind] = useState("Major");
  const isMinor = scaleKind === "Minor";

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [key, setKey] = useState("C");
  const [style, setStyle] = useState("Pop");
  const [flashIndex, setFlashIndex] = useState(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const depth = 3;

  const [installed, setInstalled] = useState(false);

  const [flashNext1, setFlashNext1] = useState(false);
  const flashTimerRef = useRef(null);
  const firstLoadRef = useRef(true);

  function stepTo(nextDeg) {
    updateActiveSection((sec) => {
      sec.currentDeg = nextDeg;
      sec.path = [...sec.path, nextDeg];
      return sec;
    });
    setFlashIndex(path.length);
    setTimeout(() => setFlashIndex(null), 500);

    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlashNext1(true);
    flashTimerRef.current = setTimeout(() => setFlashNext1(false), 420);
  }

  useEffect(() => {
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true; // iOS用
    setInstalled(!!isStandalone);

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const [sections, setSections] = useState(() => {
    const startDeg = "I";
    return [
      {
        id: String(Date.now()),
        name: "Verse",
        path: [startDeg],
        currentDeg: startDeg,
      },
    ];
  });

  const [activeSectionId, setActiveSectionId] = useState(() => sections[0]?.id);

  const active = sections.find((s) => s.id === activeSectionId) || sections[0];
  const path = active?.path || ["I"];
  const currentDeg = active?.currentDeg || "I";

  const degreeToChord = useKeyMap(key, isMinor);

  function updateActiveSection(updater) {
    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? updater({ ...s }) : s))
    );
  }

  useEffect(() => {
    const newKey = isMinor ? "Am" : "C";
    const startDeg = isMinor ? "i" : "I";
    setKey(newKey);
    setSections((prev) =>
      prev.map((s) => ({ ...s, path: [startDeg], currentDeg: startDeg }))
    );
  }, [isMinor]);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const onInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();

    try {
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome) {
        console.log("PWA install:", choiceResult.outcome);
      } else {
        console.log("PWA install result unknown or not supported");
      }
    } catch (err) {
      console.error("Install prompt failed:", err);
    } finally {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  }

  function resetToKey(k) {
    setKey(k);
    const startDeg = isMinor ? "i" : "I";
    updateActiveSection((sec) => {
      sec.currentDeg = startDeg;
      sec.path = [startDeg];
      return sec;
    });
    setFlashIndex(0);
    setTimeout(() => setFlashIndex(null), 500);
  }

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlashNext1(true);
    flashTimerRef.current = setTimeout(() => setFlashNext1(false), 900);
  }, [currentDeg, style, isMinor]);

  function jumpTo(index) {
    if (index < 0 || index >= path.length) return;
    updateActiveSection((sec) => {
      const next = sec.path.slice(0, index + 1);
      sec.path = next;
      sec.currentDeg = next[next.length - 1];
      return sec;
    });
  }

  function undoLast() {
    if (path.length <= 1) return;
    updateActiveSection((sec) => {
      const next = sec.path.slice(0, -1);
      sec.path = next;
      sec.currentDeg = next[next.length - 1];
      return sec;
    });
  }

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoLast();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const degreeLayers = useMemo(() => {
    const rules =
      (isMinor ? styleGenreMinor : styleGenre)[style] || styleGenre.Pop;
    let frontier = [currentDeg];
    return Array.from({ length: depth }, () => {
      const nextLayer = Array.from(
        new Set(frontier.flatMap((d) => rules[d] || []))
      );
      const res = { from: frontier, to: nextLayer };
      frontier = nextLayer;
      return res;
    });
  }, [currentDeg, depth, style, isMinor]);

  function addSection(presetName = "Section") {
    const startDeg = isMinor ? "i" : "I";
    const sec = {
      id: String(Date.now() + Math.random()),
      name: presetName,
      path: [startDeg],
      currentDeg: startDeg,
    };
    setSections((prev) => [...prev, sec]);
    setActiveSectionId(sec.id);
    setFlashIndex(0);
    setTimeout(() => setFlashIndex(null), 400);
  }
  function renameSection(id, name) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }
  function removeSection(id) {
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (!next.length) return prev; // 少なくとも1つは残す
      if (id === activeSectionId) setActiveSectionId(next[0].id);
      return next;
    });
  }

  const LS_KEY = "cpm.playlists.v1";
  function getPlaylists() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function setPlaylists(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }
  function savePlaylist(name) {
    const item = {
      id: String(Date.now()),
      name,
      createdAt: Date.now(),
      data: {
        scaleKind,
        key,
        style,
        isMinor,
        sections,
      },
    };
    const arr = getPlaylists();
    arr.unshift(item);
    setPlaylists(arr);
  }
  function loadPlaylistById(id) {
    const item = getPlaylists().find((p) => p.id === id);
    if (!item) return;
    const d = item.data;
    setScaleKind(d.scaleKind);
    setKey(d.key);
    setStyle(d.style);
    setSections(d.sections);
    setActiveSectionId(d.sections[0]?.id);
  }
  function deletePlaylistById(id) {
    const arr = getPlaylists().filter((p) => p.id !== id);
    setPlaylists(arr);
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Chord Progression Map</h1>
      </header>
      <div className="topBarMobile">
        <button
          className="iconBtn"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="titleXS">Chord Progression Map</div>
        <div style={{ width: 36 }} />
      </div>
      <div className="appLayout">
        <aside className="sidebar" data-open={drawerOpen}>
          <PlaylistBar
            onSave={savePlaylist}
            onLoadById={loadPlaylistById}
            onDeleteById={deletePlaylistById}
            listProvider={getPlaylists}
          />
          <SectionsMini
            sections={sections}
            activeId={activeSectionId}
            onSwitch={setActiveSectionId}
            onAddPreset={addSection}
            onRename={renameSection}
            onRemove={removeSection}
            degreeToChord={degreeToChord}
          />
        </aside>

        <main
          className="mainContent"
          onClick={() => drawerOpen && setDrawerOpen(false)}
        >
          <div className="topBar">
            <Controls
              keyName={key}
              onChangeKey={resetToKey}
              styleName={style}
              onChangeStyle={setStyle}
              majorKeys={majorKeys}
              minorKeys={Object.keys(minorKeys)}
              styleNames={styleNames}
              scaleKind={scaleKind}
              onChangeScaleKind={setScaleKind}
            />
            <div className="spacer" />
            <div className="topBarActions">
              <button
                className="btnPrimary"
                onClick={undoLast}
                disabled={path.length <= 1}
              >
                Undo
              </button>
              <button className="btnGhost" onClick={() => resetToKey(key)}>
                Clear
              </button>
              {canInstall && !installed && (
                <button className="btnPrimary" onClick={handleInstallClick}>
                  Install App
                </button>
              )}
            </div>
          </div>

          <PathBar
            path={path}
            degreeToChord={degreeToChord}
            onJump={jumpTo}
            flashIndex={flashIndex}
            hideActions
            flipped
          />

          <SectionsStrip
            sections={sections}
            activeId={activeSectionId}
            onSwitch={setActiveSectionId}
            degreeToChord={degreeToChord}
          />
          <AllChordsBar
            degreeToChord={degreeToChord}
            degrees={isMinor ? minorDegrees : degrees}
            onStep={(deg) => stepTo(deg)}
          />

          <div className="grid">
            <Column title="Now">
              <Node
                label={`${degreeToChord[currentDeg]} (${currentDeg})`}
                degree={currentDeg}
                active
              />
            </Column>
            {degreeLayers.map((layer, i) => (
              <Column
                key={i}
                title={`Next ${i + 1}`}
                className={
                  i === 0
                    ? `next1 ${flashNext1 ? "pulse" : ""}`
                    : i === 1
                    ? "next2"
                    : i === 2
                    ? "next3"
                    : ""
                }
              >
                {layer.to.length === 0 ? (
                  <div className="muted">no candidates</div>
                ) : (
                  layer.to.map((deg) => (
                    <Node
                      key={deg}
                      label={`${degreeToChord[deg]} (${deg})`}
                      degree={deg}
                      onClick={() => stepTo(deg)}
                    />
                  ))
                )}
              </Column>
            ))}
          </div>
        </main>
      </div>
      <PlaylistDrawer
        open={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        onSave={savePlaylist}
        onLoadById={loadPlaylistById}
        onDeleteById={deletePlaylistById}
        listProvider={getPlaylists}
      />
    </div>
  );
}
