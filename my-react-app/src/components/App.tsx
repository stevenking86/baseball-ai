import React, { useEffect, useState } from 'react';

type Homerun = {
  player: string;
  distance: number;
  game: string;
  team: string;
  pitchType: string;
};

const palette = {
  deepBlue: "#244855",
  redOrange: "#E64833",
  brown: "#874F41",
  teal: "#90AEAD",
  cream: "#FBE9D0",
};

const App = () => {
  const [hr, setHr] = useState<Homerun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/furthest-homer')
      .then(res => res.json())
      .then(data => {
        setHr(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${palette.deepBlue} 0%, ${palette.teal} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <p style={{ color: palette.cream, fontSize: 22, fontWeight: 600 }}>Loading...</p>
    </div>
  );
  if (!hr) return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${palette.deepBlue} 0%, ${palette.teal} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <p style={{ color: palette.cream, fontSize: 22, fontWeight: 600 }}>No home runs found yesterday.</p>
    </div>
  );

return (
  <>
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${palette.deepBlue} 0%, ${palette.teal} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          padding: 32,
          borderRadius: 28,
          boxShadow: "0 8px 32px rgba(36,72,85,0.18)",
          border: `3px solid ${palette.brown}`,
          background: `linear-gradient(120deg, ${palette.cream} 80%, ${palette.teal} 100%)`,
          color: palette.deepBlue,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 18,
            color: palette.redOrange,
            letterSpacing: 1,
          }}
        >
          Furthest Home Run (Yesterday)
        </h2>
                <p style={{ color: palette.brown, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
          <span style={{ color: palette.deepBlue }}>Player:</span> {hr.player}
        </p>
        <p style={{ color: palette.brown, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
          <span style={{ color: palette.deepBlue }}>Distance:</span> {hr.distance} ft
        </p>
        <p style={{ color: palette.brown, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
          <span style={{ color: palette.deepBlue }}>Team:</span> {hr.team}
        </p>
        <p style={{ color: palette.brown, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
          <span style={{ color: palette.deepBlue }}>Pitch Type:</span> {hr.pitchType}
        </p>
      </div>
    </div>
    <a
      href="https://github.com/stevenking86"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 10,
        left: 0,
        width: "100%",
        textAlign: "center",
        fontSize: 12,
        color: palette.cream,
        opacity: 0.7,
        letterSpacing: 0.5,
        textDecoration: "none",
        zIndex: 1000,
      }}
    >
      © {new Date().getFullYear()} Steven Gerhardt-King &middot; GitHub
    </a>
  </>
);

};

export default App;