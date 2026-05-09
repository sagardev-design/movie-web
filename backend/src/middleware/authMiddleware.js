import asyncHandler from 'express-async-handler';
import { verifyToken } from '@clerk/backend';
import { upsertClerkUser } from '../models/User.js';
import { clerkClient } from '../config/clerk.js';

const defaultAuthorizedParties = 'http://localhost:5173';

function getAuthorizedParties() {
  return `${defaultAuthorizedParties},${process.env.CLIENT_URL || ''}`
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const protect = (req, res, next) => {
  return protectWithClerk(req, res, next);
};

export const protectWithClerk = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    logClerkRejection(req, { reason: 'missing_authorization_header' });
    return throwUnauthorized();
  }

  const token = authHeader.split(' ')[1];
  let payload;

  try {
    payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: [...new Set(getAuthorizedParties())],
    });
  } catch (error) {
    logClerkRejection(req, { reason: 'token_verification_failed', message: error.message });
    return throwUnauthorized(error.message);
  }

  const userId = payload.sub;

  if (!userId) {
    logClerkRejection(req, { reason: 'missing_user_id' });
    return throwUnauthorized();
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const primaryEmail =
    clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    const error = new Error('Clerk user does not have an email address');
    error.statusCode = 400;
    throw error;
  }

  req.user = await upsertClerkUser({
    clerkId: userId,
    name: clerkUser.fullName || clerkUser.username || primaryEmail,
    email: primaryEmail,
  });
  req.auth = { userId, sessionId: payload.sid };

  next();
});

function logClerkRejection(req, details) {
  if (process.env.NODE_ENV === 'production') return;

  console.warn('Clerk auth rejected request', {
    path: req.originalUrl,
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    authorizationScheme: req.headers.authorization?.split(' ')[0],
    ...details,
  });
}

function throwUnauthorized(detail) {
  const message = process.env.NODE_ENV === 'production' || !detail ? 'Not authorized' : `Not authorized: ${detail}`;
  const error = new Error(message);
  error.statusCode = 401;
  throw error;
}
