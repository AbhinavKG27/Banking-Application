const { getBalanceByUsername } = require('../models/userModel');

const getBalance = async (req, res) => {
  try {
    if (req.user.role !== 'Customer') {
      return res.status(403).json({ message: 'Access denied. Customer role required.' });
    }

    const account = await getBalanceByUsername(req.user.username);
    if (!account) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    return res.status(200).json({ balance: account.balance });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch balance.', error: error.message });
  }
};

module.exports = {
  getBalance,
};
