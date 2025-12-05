const User = require('../models/User');

const generateUserId = async () => {
  let userId;
  let isUnique = false;

  while (!isUnique) {
    // Generate random 5-digit number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    userId = `TP-${randomNum}`;

    // Check if userId already exists
    const existingUser = await User.findOne({ userId });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return userId;
};

module.exports = generateUserId;
