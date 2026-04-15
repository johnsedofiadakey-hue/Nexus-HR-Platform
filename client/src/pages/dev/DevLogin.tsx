import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../services/firebase';
import { signInWithPopup } from 'firebase/auth';

const DevLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      // Store the token for the interceptor
      localStorage.setItem('nexus_dev_firebase_token', token);
      localStorage.setItem('nexus_dev_user', JSON.stringify({
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL
      }));

      // Set a flag to tell the interceptor we are in Dev Mode
      localStorage.setItem('nexus_dev_mode', 'true');
      
      navigate('/nexus-master-console');
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setError(err.message || 'Failed to authenticate with Google');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020817', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Animated grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Terminal header */}
        <div style={{ background: '#0d1526', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.05)' }}>
          {/* Terminal titlebar */}
          <div style={{ background: '#060e1c', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: 11, color: '#475569', letterSpacing: '0.1em' }}>nexus-dev-portal — identity-v2</span>
          </div>

          <div style={{ padding: '40px 36px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M12 8v4"/>
                    <path d="M12 16h.01"/>
                 </svg>
              </div>
              <h1 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>SECURE ACCESS</h1>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>Google Identity Federation Required</p>
            </div>

            <div style={{ marginBottom: 32, padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 12 }}>SERVER_LOG: Initiating OAuth2 challenge...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#22c55e', fontSize: 12 }}>O</span>
                <span style={{ color: '#64748b', fontSize: 11 }}>Identity Provider: accounts.google.com</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              style={{ 
                width: '100%', 
                background: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                color: '#1e293b', 
                padding: '14px', 
                fontWeight: 700, 
                fontSize: 14, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.2s'
              }}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
              {loading ? 'AUTHENTICATING...' : 'Sign in with Google'}
            </button>

            {error && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 20, textAlign: 'center' }}>⚠ {error}</p>}

            <p style={{ color: '#1e3a5f', fontSize: 10, textAlign: 'center', marginTop: 32, letterSpacing: '0.1em' }}>
              PROTECTED BY FIREBASE IDENTITY SHIELD
            </p>
          </div>
        </div>

        <p style={{ color: '#1e293b', fontSize: 10, textAlign: 'center', marginTop: 12, letterSpacing: '0.08em' }}>
          NEXUS HR PLATFORM DEV PORTAL · {new Date().getFullYear()}
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
export default DevLogin;
