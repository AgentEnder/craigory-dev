import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // This key is public, auth is handled by firestore rules
  apiKey: 'AIzaSyBU1YHxIyaVqkRPm4hU8K29zZ15Y1Y21Vc',
  authDomain: 'craigory-dev-bar-menu.firebaseapp.com',
  projectId: 'craigory-dev-bar-menu',
  storageBucket: 'craigory-dev-bar-menu.firebasestorage.app',
  messagingSenderId: '639006753140',
  appId: '1:639006753140:web:428e8dad285c228f53ec21',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
