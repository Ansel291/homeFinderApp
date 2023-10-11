import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD7nN72D-2wFnI7GLuVze4ZByDH-Rv50p0',
  authDomain: 'home-finder-app-3b0b6.firebaseapp.com',
  projectId: 'home-finder-app-3b0b6',
  storageBucket: 'home-finder-app-3b0b6.appspot.com',
  messagingSenderId: '445391200091',
  appId: '1:445391200091:web:345ba02c7dbfecaeebc47e',
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
