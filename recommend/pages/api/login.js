import { compare } from 'bcryptjs';

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // TODO: Fetch the user from database based on email.
    // all below contents of user would have come from the database
    const user = {
      id: 'dummy-user-id',
      email,
      passwordHash: '',
      name: 'user'
    };

    // eventually, compare the provided password with the stored hash:
    // const isValid = await compare(password, user.passwordHash);
    // For this demo, if the password is not exactly 'test', consider it invalid.
    if (password !== 'test') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // On successful authentication, generate a token or session.
    // Here we return a stand-in token.
    const token = 'token';

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}