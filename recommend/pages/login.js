import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
    } else {
      // Save token in localStorage (maybe a cookie later)
      localStorage.setItem('token', data.token);
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className='bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#005bb5] transition-colors'>Login</button>
      </form>
      <p>
        Don’t have an account? <a href="/register" className='bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#005bb5] transition-colors'>Register here</a>.
      </p>
    </div>
  );
}