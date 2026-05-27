import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from '@/models/User';

export async function protect(req) {
  await connectDB();
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('Not authorized, no token provided');
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new Error('Not authorized, user not found');
    }

    return user;
  } catch (error) {
    throw new Error('Not authorized, token verification failed');
  }
}
