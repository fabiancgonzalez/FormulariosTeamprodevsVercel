import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../services/data.service';

interface PersonaConMascotas {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  mascotas: any[];
}

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './reporte.html',
  styleUrl: './reporte.css',
})
export class Reporte implements OnInit {
  personas = signal<PersonaConMascotas[]>([]);
  personasFiltradas = signal<PersonaConMascotas[]>([]);
  filtroNombre = signal('');
  cargando = signal(true);
  error = signal('');

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.error.set('');
    
    this.dataService.getPersonasConMascotas().subscribe({
      next: (data) => {
        this.personas.set(data);
        this.personasFiltradas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar datos: ' + err.message);
        this.cargando.set(false);
      }
    });
  }

  filtrarPorNombre() {
    const filtro = this.filtroNombre().toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (!filtro) {
      this.personasFiltradas.set(this.personas());
      return;
    }

    const filtradas = this.personas().filter(persona => 
      persona.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro) || 
      persona.apellido.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro)
    );
    
    this.personasFiltradas.set(filtradas);
  }
}
