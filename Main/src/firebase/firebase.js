import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, getDocs, where, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const getCoupletByNumber = async (number) => {
  const q = query(collection(db, 'thirukural'), where('Number', '==', number));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data())[0];
};

export const getCoupletsByChapter = async (chapter) => {
  const start = (chapter - 1) * 10 + 1;
  const end = chapter * 10;
  const q = query(collection(db, 'thirukural'), where('Number', '>=', start), where('Number', '<=', end));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};

export const getRandomCouplets = async (count) => {
  const snapshot = await getDocs(collection(db, 'thirukural'));
  const allCouplets = snapshot.docs.map(doc => doc.data());
  return allCouplets.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const saveQuery = async (userId, query) => {
  await addDoc(collection(db, 'queries'), { userId, query, timestamp: serverTimestamp() });
};

export const getQueryHistory = async (userId) => {
  const q = query(collection(db, 'queries'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};