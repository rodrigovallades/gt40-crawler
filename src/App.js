import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import Cars from './pages/Cars';
import { firebaseConfig } from './config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  return <Cars />;
}
