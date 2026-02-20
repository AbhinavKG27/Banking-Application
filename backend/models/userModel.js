const pool = require('../config/db');

const createUser = async ({ uid, username, email, password, phone, role }) => {
  const query = `
    INSERT INTO KodUser (uid, username, email, password, phone, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(query, [uid, username, email, password, phone, role]);
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM KodUser WHERE username = ? LIMIT 1';
  const [rows] = await pool.execute(query, [username]);
  return rows[0] || null;
};

const getBalanceByUsername = async (username) => {
  const query = 'SELECT balance FROM KodUser WHERE username = ? LIMIT 1';
  const [rows] = await pool.execute(query, [username]);
  return rows[0] || null;
};

module.exports = {
  createUser,
  getUserByUsername,
  getBalanceByUsername,
};
