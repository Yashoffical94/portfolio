// Loading screen shown during lazy-load Suspense fallback
export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: '#050816',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Aura rings */}
      {[80, 120, 160].map((size, i) => (
        <div
          key={size}
          style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: '1px solid rgba(249,115,22,0.3)',
            animation: `auraPulse 3s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Core orb */}
      <div
        style={{
          width: 48, height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #fbbf24)',
          boxShadow: '0 0 30px rgba(249,115,22,0.6), 0 0 60px rgba(249,115,22,0.3)',
          animation: 'kiGlow 2s ease-in-out infinite alternate',
          zIndex: 1,
        }}
      />

      <p
        style={{
          marginTop: 32,
          color: '#f97316',
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          animation: 'fadeIn 0.5s ease-in-out',
        }}
      >
        Loading...
      </p>
    </div>
  )
}
