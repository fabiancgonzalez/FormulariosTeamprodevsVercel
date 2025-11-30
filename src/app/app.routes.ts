import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './components/home/home';
import { Nosotros } from './components/nosotros/nosotros';
import { Reporte } from './components/reporte/reporte';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'nosotros', component: Nosotros },
  { path: 'reporte', component: Reporte },
];
