import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulariopersona',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './formulariopersona.html',
  styleUrl: './formulariopersona.css',
})
export class Formulariopersona {
  personaId = signal<number | null>(null);
  nombre = signal('');
  apellido = signal('');
  email = signal('');
  telefono = signal('');
  fechaNacimiento = signal('');
  estatura = signal('');
  mensajeGuardado = signal('');
  cargando = signal(false);
  error = signal('');
  personas = signal<any[]>([]);
  modoEdicion = signal(false);

  constructor(private dataService: DataService) {
    this.cargarPersonas();
  }

  guardarPersona() {
    // Validar que los campos requeridos estén llenos
    if (!this.nombre() || !this.apellido()) {
      this.error.set('Por favor completa los campos requeridos (Nombre y Apellido)');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeGuardado.set('');

    const datosPersona = {
      nombre: this.nombre(),
      apellido: this.apellido(),
      email: this.email(),
      telefono: this.telefono(),
      fecha_nacimiento: this.fechaNacimiento(),
      estatura: this.estatura()
    };

    this.dataService.crearPersona(datosPersona).subscribe({
      next: (response) => {
        this.cargando.set(false);
        this.mensajeGuardado.set('¡Persona guardada exitosamente!');
        this.limpiarFormulario();
        this.cargarPersonas();
        setTimeout(() => this.mensajeGuardado.set(''), 5000);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set('Error al guardar la persona: ' + err.message);
      }
    });
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

  seleccionarPersona(persona: any) {
    this.personaId.set(persona.id);
    this.nombre.set(persona.nombre);
    this.apellido.set(persona.apellido);
    this.email.set(persona.email || '');
    this.telefono.set(persona.telefono || '');
    this.fechaNacimiento.set(persona.fecha_nacimiento || '');
    this.estatura.set(persona.estatura || '');
    this.modoEdicion.set(true);
    this.mensajeGuardado.set('');
    this.error.set('');
  }

  actualizarPersona() {
    if (!this.personaId()) {
      this.error.set('No hay persona seleccionada para actualizar');
      return;
    }

    if (!this.nombre() || !this.apellido()) {
      this.error.set('Por favor completa los campos requeridos (Nombre y Apellido)');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeGuardado.set('');

    const datosPersona: any = {
      nombre: this.nombre(),
      apellido: this.apellido(),
      email: this.email() || null,
      telefono: this.telefono() || null,
      fecha_nacimiento: this.fechaNacimiento() || null,
      estatura: this.estatura() ? parseFloat(this.estatura()) : null
    };

    console.log('Actualizando persona:', this.personaId(), datosPersona);

    this.dataService.actualizarPersona(this.personaId()!, datosPersona).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.cargando.set(false);
        this.mensajeGuardado.set('¡Persona actualizada exitosamente!');
        this.limpiarFormulario();
        this.cargarPersonas();
        setTimeout(() => this.mensajeGuardado.set(''), 5000);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.cargando.set(false);
        this.error.set('Error al actualizar la persona: ' + err.message);
      }
    });
  }

  eliminarPersona() {
    if (!this.personaId()) {
      this.error.set('No hay persona seleccionada para eliminar');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta persona? Esta acción eliminará también todas sus mascotas asociadas.')) {
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensajeGuardado.set('');

    this.dataService.eliminarPersona(this.personaId()!).subscribe({
      next: (response) => {
        this.cargando.set(false);
        this.mensajeGuardado.set('¡Persona eliminada exitosamente!');
        this.limpiarFormulario();
        this.cargarPersonas();
        setTimeout(() => this.mensajeGuardado.set(''), 5000);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set('Error al eliminar la persona: ' + err.message);
      }
    });
  }

  limpiarFormulario() {
    this.personaId.set(null);
    this.nombre.set('');
    this.apellido.set('');
    this.email.set('');
    this.telefono.set('');
    this.fechaNacimiento.set('');
    this.estatura.set('');
    this.modoEdicion.set(false);
  }
}
