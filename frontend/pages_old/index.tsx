export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexDirection: 'column'
    }}>
      <h1 style={{fontSize: '60px'}}>✅ TaskFlow</h1>
      <p style={{fontSize: '24px', marginTop: '20px'}}>Frontend is working!</p>
      <p style={{fontSize: '18px', marginTop: '30px'}}>
        <a href="/signin" style={{color: 'yellow', fontSize: '20px'}}>Go to Sign In →</a>
      </p>
    </div>
  )
}
