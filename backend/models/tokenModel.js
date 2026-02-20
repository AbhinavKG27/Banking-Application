const pool = require('../config/db');

const storeUserToken = async ({ token, uid, expiry }) => {
  const query = 'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)';
  await pool.execute(query, [token, uid, expiry]);
};

const getTokenRecord = async (token) => {
  const query = 'SELECT * FROM UserToken WHERE token = ? ORDER BY tid DESC LIMIT 1';
  const [rows] = await pool.execute(query, [token]);
  return rows[0] || null;
};

module.exports = {
  storeUserToken,
  getTokenRecord,
};
