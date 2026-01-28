import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px' }}>
      <nav style={{ backgroundColor: '#f3f4f6', padding: '16px', marginBottom: '20px', borderRadius: '8px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold' }}>BiznesAsh</h1>
      </nav>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
          Welcome to BiznesAsh
        </h1>
        <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '32px' }}>
          Connect, share, and engage with your professional network
        </p>

        {!isAuthenticated && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="/login">
              <button style={{ 
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                Login
              </button>
            </a>
            <a href="/register">
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                Register
              </button>
            </a>
          </div>
        )}

        {isAuthenticated && (
          <a href="/feed">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Go to Feed
            </button>
          </a>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Share Your Thoughts</h3>
          <p style={{ color: '#4b5563' }}>
            Create posts and share your ideas with your professional network.
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Engage & Connect</h3>
          <p style={{ color: '#4b5563' }}>
            Like, comment, and interact with content from people you follow.
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Stay Updated</h3>
          <p style={{ color: '#4b5563' }}>
            Get notified about activity from your network and stay in the loop.
          </p>
        </div>
      </div>
    </div>
  );
};
