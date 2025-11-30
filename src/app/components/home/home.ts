import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formulariopersona } from '../formulariopersona/formulariopersona';
import { Formulariomascota } from '../formulariomascota/formulariomascota';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Formulariopersona, Formulariomascota],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  mostrarFormularioPersona = signal(false);
  mostrarFormularioMascota = signal(false);

  mostrarPersona() {
    this.mostrarFormularioPersona.set(true);
    this.mostrarFormularioMascota.set(false);
  }

  mostrarMascota() {
    this.mostrarFormularioMascota.set(true);
    this.mostrarFormularioPersona.set(false);
  }
}
