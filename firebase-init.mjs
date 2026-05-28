import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBfXa47TNdhOHuNN84Z0aM3eIWh6aa-14Y',
  authDomain: 'portfolio-49787.firebaseapp.com',
  projectId: 'portfolio-49787',
  storageBucket: 'portfolio-49787.firebasestorage.app',
  messagingSenderId: '2112794829',
  appId: '1:2112794829:web:857c99bb2b1590ab51b984',
  measurementId: 'G-29SJMRXWWR',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics = null;
try {
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
} catch {
  analytics = null;
}

window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseDb = db;

window.saveBookingToFirestore = async (bookingData) => {
  const payload = {
    name: bookingData.name || '',
    email: bookingData.email || '',
    date: bookingData.date || '',
    time: bookingData.time || '',
    location: bookingData.location || '',
    state: bookingData.state || '',
    city: bookingData.city || '',
    notes: bookingData.notes || '',
    source: 'portfolio-booking-form',
    userAgent: navigator.userAgent,
    pageUrl: window.location.href,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'bookings'), payload);
  return docRef.id;
};

export { app, analytics, db };