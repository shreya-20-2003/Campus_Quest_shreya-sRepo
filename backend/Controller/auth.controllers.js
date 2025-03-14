import User from '../models/User.model.js';
import VerificationToken from '../models/VerificationToken.js';
import sendVerificationEmail from '../utils/send-otp.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { setToken } from '../utils/token.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In Handler
export const googleSignIn = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, email, name, picture } = ticket.getPayload();
    
    // Find or Create User
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ googleId: sub, email, name, picture, isVerified: true });
      await user.save();
    }

    res.status(200).json({ message: "Google Sign-In Successful", user });
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    res.status(401).json({ message: 'Invalid Google ID token' });
  }
};

// User Registration Handler
export const Register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash Password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, isVerified: false });
    await user.save();
    
    await sendVerificationEmail(req, email);
    return res.status(200).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in Register function:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// User Login Handler
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      await sendVerificationEmail(req, email);
      return res.status(403).json({ message: 'User not verified. Verification email sent.' });
    }

    const accessToken = setToken(user);
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in Login function:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Logout Handler
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', error });
  }
};

// Email Verification Handler
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const verificationToken = await VerificationToken.findOne({ email });
    if (!verificationToken || otp !== verificationToken.token) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ email });

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Refresh Token Handler
export const tokenController = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      
      const newAccessToken = setToken(decoded.userId);
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
      return res.status(200).json({ message: "Token refreshed successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error refreshing token", error });
  }
};

// Get User Profile Handler
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
