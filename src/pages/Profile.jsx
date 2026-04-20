import React from 'react';
import { User, Settings, History, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, testHistory } = useAuth();

  if (!user) {
    return (
      <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <h1 className="title">Not Logged In</h1>
        <p style={{ color: 'var(--sub-color)' }}>Please login to view your profile.</p>
        <div style={{ marginTop: '2rem' }}>
          <a href="/login" className="nav-item" style={{ display: 'inline-block', color: 'var(--main-color)' }}>Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: '#1a1a1a', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '0 auto 1.5rem',
          border: '2px solid var(--main-color)'
        }}>
          <User size={50} color="var(--main-color)" />
        </div>
        <h1 className="title" style={{ color: 'var(--main-color)', margin: '0' }}>{user.username || 'User'}</h1>
        <p style={{ color: 'var(--sub-color)' }}>{user.email}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--sub-color)', fontSize: '0.8rem', margin: '0' }}>tests started</p>
            <p style={{ fontSize: '1.5rem', color: 'var(--main-color)', margin: '0' }}>{testHistory.length}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--sub-color)', fontSize: '0.8rem', margin: '0' }}>avg. wpm</p>
            <p style={{ fontSize: '1.5rem', color: 'var(--main-color)', margin: '0' }}>
              {testHistory.length > 0 
                ? Math.round(testHistory.reduce((acc, curr) => acc + curr.wpm, 0) / testHistory.length)
                : 0}
            </p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} color="var(--main-color)" />
          Recent Tests
        </h2>
        
        {testHistory.length === 0 ? (
          <p style={{ color: 'var(--sub-color)', textAlign: 'center', padding: '2rem' }}>No tests completed yet. Start typing!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2c2e31', color: 'var(--sub-color)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '0.8rem' }}>wpm</th>
                  <th style={{ padding: '0.8rem' }}>accuracy</th>
                  <th style={{ padding: '0.8rem' }}>raw</th>
                  <th style={{ padding: '0.8rem' }}>mode</th>
                  <th style={{ padding: '0.8rem' }}>date</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((test) => (
                  <tr key={test.id} style={{ borderBottom: '1px solid #2c2e31', fontSize: '1rem' }}>
                    <td style={{ padding: '0.8rem', color: 'var(--main-color)', fontWeight: 'bold' }}>{test.wpm}</td>
                    <td style={{ padding: '0.8rem' }}>{test.accuracy}%</td>
                    <td style={{ padding: '0.8rem', color: 'var(--sub-color)' }}>{test.rawWpm}</td>
                    <td style={{ padding: '0.8rem', color: 'var(--sub-color)', fontSize: '0.8rem' }}>{test.mode}</td>
                    <td style={{ padding: '0.8rem', color: 'var(--sub-color)', fontSize: '0.8rem' }}>
                      {new Date(test.date).toLocaleDateString()} {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
