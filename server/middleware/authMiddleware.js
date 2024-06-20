import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../db/models/userModel.js';
import { generateToken } from '../lib/generateToken.js';
import config from '../config/index.js';
import { HTTP_CODES } from '../config/Enum.js';
import CustomError from '../lib/Error.js';
import Response from '../lib/Response.js';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  let refreshToken = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      if (decoded) {
        req.user = await User.findById(decoded.id).select('-password');
        next();
      } else {
        throw new CustomError(
          HTTP_CODES.UNAUTHORIZED,
          'Not authorized',
          'Invalid or expired access token'
        );
      }
    } catch (error) {
      throw new CustomError(
        HTTP_CODES.UNAUTHORIZED,
        'Not authorized',
        'Invalid or expired access token'
      );
    }
  } else if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
      if (decoded) {
        const { accessToken } = generateToken(res, decoded.id, decoded.isAdmin);
        req.user = await User.findById(decoded.id).select('-password');
        req.accessToken = accessToken; // Optional: Store accessToken in request for future use
        next();
      } else {
        throw new CustomError(
          HTTP_CODES.UNAUTHORIZED,
          'Not authorized',
          'Invalid or expired refresh token'
        );
      }
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  } else {
    res.status(HTTP_CODES.UNAUTHORIZED);
    const errorResponse = Response.errorResponse(
      new CustomError(
        HTTP_CODES.UNAUTHORIZED,
        'Not authorized',
        'No token found'
      )
    );
    res.json(errorResponse);
  }
});

const admin = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next(); // İzin verilen kullanıcı ise bir sonraki middleware'e geç
    } else {
      throw new CustomError(
        HTTP_CODES.UNAUTHORIZED,
        'Authorization Error',
        'Admin permission required 1'
      ); // Admin yetkisi yoksa hata ile birlikte next() fonksiyonu çağrılır
    }
  } catch (error) {
    const errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

const loginControl = asyncHandler(async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  try {
    if (refreshToken) {
      // Kullanıcı giriş yapmışsa, daha fazla işlem yapmadan hemen hata döndürün
      throw new CustomError(
        HTTP_CODES.CONFLICT,
        'Already logged in',
        'User is already logged in'
      );
    } else {
      // Kullanıcı giriş yapmamışsa, devam edin
      next();
    }
  } catch (error) {
    const errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

export { protect, admin, loginControl };
