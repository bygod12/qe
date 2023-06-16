import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { initializeApp } from 'firebase/app'; // Importe o método initializeApp do Firebase

if (environment.production) {
  enableProdMode();
}

// Inicialize o Firebase
initializeApp(environment.firebase);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
