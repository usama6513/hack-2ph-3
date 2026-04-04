export default function Signin() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize: '36px', marginBottom: '30px'}}>Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: 'none',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button style={{
          width: '100%',
          padding: '15px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Sign In
        </button>
        <p style={{marginTop: '20px'}}>
          <a href="/" style={{color: '#FFD700'}}>← Back to Home</a>
        </p>
      </div>
    </div>
  )
}
