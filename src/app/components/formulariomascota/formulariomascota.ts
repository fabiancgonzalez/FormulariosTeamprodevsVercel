import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulariomascota',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './formulariomascota.html',
  styleUrl: './formulariomascota.css',
})
export class Formulariomascota {
  mascotaId = signal<number | null>(null);
  idPersona = signal<number | null>(null);
  nombre = signal('');
  especie = signal('');
  raza = signal('');
  color = signal('');
  edad = signal('');
  mensajeGuardado = signal('');
  cargando = signal(false);
  error = signal('');
  mascotas = signal<any[]>([]);
  personas = signal<any[]>([]);
  modoEdicion = signal(false);

  constructor(private dataService: DataService) {
    this.cargarMascotas();
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.dataService.getPersonas().subscribe({
      next: (data) => {
        this.personas.set(data);
      },
      error: (err) => {
        console.error('Error al cargar personas:', err);
      }
    });
  }

  compareFn(a: any, b: any): boolean {
    return a === b;
  }

  guardarMascota() {
    // Validar que los campos requeridos estén llenos
    if (!this.nombre() || !this.especie()) {
      this.error.set('Por favor completa los campos requeridos (Nombre y Especie)');
      return;
    }

    if (!this.idPersona()) {
      this.error.set('Por favor selecciona una persona');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeGuardado.set('');

    const datosMascota: any = {
      nombre: this.nombre(),
      tipo: this.especie(),
      raza: this.raza() || null,
      color: this.color() || null,
      edad: this.edad() ? parseInt(this.edad()) : null,
      id_persona: this.idPersona()
    };

    console.log('Guardando mascota:', datosMascota);

    this.dataService.crearMascota(datosMascota).subscribe({
      next: (response) => {
        console.log('Mascota guardada:', response);
        this.cargando.set(false);
        this.mensajeGuardado.set('¡Mascota guardada exitosamente!');
        this.limpiarFormulario();
        this.cargarMascotas();
        setTimeout(() => this.mensajeGuardado.set(''), 5000);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set('Error al guardar la mascota: ' + err.message);
      }
    });
  }

  cargarMascotas() {
    this.dataService.getMascotas().subscribe({
      next: (data) => {
        this.mascotas.set(data);
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
      }
    });
  }

  seleccionarMascota(mascota: any) {
    this.mascotaId.set(mascota.id);
    this.nombre.set(mascota.nombre);
    this.especie.set(mascota.tipo);
    this.raza.set(mascota.raza || '');
    this.color.set(mascota.color || '');
    this.edad.set(mascota.edad ? mascota.edad.toString() : '');
    this.idPersona.set(mascota.id_persona || null);
    this.modoEdicion.set(true);
    this.mensajeGuardado.set('');
    this.error.set('');
  }

  actualizarMascota() {
    if (!this.mascotaId()) {
      this.error.set('No hay mascota seleccionada para actualizar');
      return;
    }

    if (!this.nombre() || !this.especie()) {
      this.error.set('Por favor completa los campos requeridos (Nombre y Especie)');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeGuardado.set('');

    const datosMascota: any = {
      nombre: this.nombre(),
      tipo: this.especie(),
      raza: this.raza() || null,
      color: this.color() || null,
      edad: this.edad() ? parseInt(this.edad()) : null,
      id_persona: this.idPersona()
    };

    console.log('Actualizando mascota:', this.mascotaId(), datosMascota);

    this.dataService.actualizarMascota(this.mascotaId()!, datosMascota).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.cargando.set(false);
        this.mensajeGuardado.set('¡Mascota actualizada exitosamente!');
        this.limpiarFormulario();
        this.cargarMascotas();
        setTimeout(() => this.mensajeGuardado.set(''), 5000);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.cargando.set(false);
        this.error.set('Error al actualizar la mascota: ' + err.message);
      }
    });
  }

  eliminarMascota() {
    if (!this.mascotaId()) {
      this.error.set('No hay mascota seleccionada para eliminar');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeGuardado.set('');

    this.dataService.eliminarMascota(this.mascotaId()!).subscribe({
      next: (response) => {
        this.cargando.set(false);
        this.mensajeGuardado.set('¡Mascota eliminada exitosamente!');
        this.limpiarFormulario();
        this.cargarMascotas();
        setTimeout(() => this.mensajeGuardado.set(''), 5000);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set('Error al eliminar la mascota: ' + err.message);
      }
    });
  }

  limpiarFormulario() {
    this.mascotaId.set(null);
    this.idPersona.set(null);
    this.nombre.set('');
    this.especie.set('');
    this.raza.set('');
    this.color.set('');
    this.edad.set('');
    this.modoEdicion.set(false);
  }
}
