import admin from 'firebase-admin';
import User from '../models/user.js';

const buildAuthError = (status, message) => ({ status, message });

export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json(buildAuthError(401, 'Authorization required'));
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.auth = decoded;
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.displayName,
        photoUrl: decoded.picture,
        role: 'citizen'
      });
    } else {
      const updates = {};
      if (decoded.email && decoded.email !== user.email) updates.email = decoded.email;
      if (decoded.name && decoded.name !== user.name) updates.name = decoded.name;
      if (decoded.picture && decoded.picture !== user.photoUrl) updates.photoUrl = decoded.picture;
      if (Object.keys(updates).length) {
        Object.assign(user, updates);
        await user.save();
      }
    }

    if (user.blocked) {
      return res.status(403).json(buildAuthError(403, 'Account is blocked'));
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json(buildAuthError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(buildAuthError(401, 'Authorization required'));
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json(buildAuthError(403, 'Forbidden'));
  }
  next();
};
