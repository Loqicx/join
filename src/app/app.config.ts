import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'join-mmc',
        appId: '1:743995687615:web:112ab39b5754a8ca7bfc0a',
        storageBucket: 'join-mmc.firebasestorage.app',
        apiKey: 'AIzaSyAAX2A5vEX7JJbae6szFNRiLN6-U7aRaXI',
        authDomain: 'join-mmc.firebaseapp.com',
        messagingSenderId: '743995687615',
        measurementId: 'G-Y0RYN7K0JQ',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
