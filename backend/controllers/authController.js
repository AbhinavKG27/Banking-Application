const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/userModel');
const { storeUserToken } = require('../models/tokenModel');

const register = async (req, res) => {
  try {
    const { uid, username, password, email, phone, role } = req.body;

    if (!uid || !username || !password || !email || !phone || !role) {
      return res.status(400).json({ message: 'All registration fields are required.' });
    }

    if (role !== 'Customer') {
      return res.status(400).json({ message: 'Only role Customer is allowed.' });
    }

    const existing = await getUserByUsername(username);
    if (existing) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      uid,
      username,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    return res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'UID, username, or email already exists.' });
    }
    return res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      {
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        subject: user.username,
        expiresIn: process.env.JWT_EXPIRY || '1h',
      },
    );

    const decoded = jwt.decode(token);
    const expiry = new Date(decoded.exp * 1000);

    await storeUserToken({
      token,
      uid: user.uid,
      expiry,
    });

    res.cookie('kodbank_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

module.exports = {
  register,
  login,
};
