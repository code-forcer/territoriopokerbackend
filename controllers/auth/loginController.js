// controllers/auth/loginController.js
const User = require('../../models/User');
const { generateToken } = require('../../utils/tokenUtils');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password, userId, identifier } = req.body;

    // Validate input
    if ((!email && !userId && !identifier) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/user ID and password',
      });
    }

    // Determine query - check if identifier is email or userId
    let query;
    if (identifier) {
      // Check if identifier looks like an email
      const isEmail = identifier.includes('@');
      query = isEmail ? { email: identifier } : { userId: identifier };
    } else {
      query = email ? { email } : { userId };
    }

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        isVerified: user.isEmailVerified,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { login };