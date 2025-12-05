import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Persona {
  _id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  cedula?: string;
  direccion?: string;
  ciudad?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mascota {
  _id?: string;
  nombre: string;
  tipo: string;
  raza?: string;
  color?: string;
  edad?: number;
  personaId: string;
  descripcion?: string;
  foto?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Backend Node.js + MongoDB Atlas
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  // ========== PERSONAS ==========

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/personas`);
  }

  getPersona(id: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/personas/${id}`);
  }

  crearPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/personas`, persona);
  }

  actualizarPersona(id: string, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/personas/${id}`, persona);
  }

  eliminarPersona(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/personas/${id}`);
  }

  // ========== MASCOTAS ==========

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/mascotas`);
  }

  getMascotasDePersona(idPersona: string): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/mascotas/persona/${idPersona}`);
  }

  crearMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.apiUrl}/mascotas`, mascota);
  }

  actualizarMascota(id: string, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/mascotas/${id}`, mascota);
  }

  eliminarMascota(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mascotas/${id}`);
  }

  // ========== REPORTES ==========

  getPersonasConMascotas(): Observable<any[]> {
    return forkJoin([
      this.getPersonas(),
      this.getMascotas()
    ]).pipe(
      map(([personas, mascotas]: [Persona[], Mascota[]]) => {
        return personas.map((persona: Persona) => ({
          ...persona,
          mascotas: mascotas.filter((mascota: Mascota) => mascota.personaId === persona._id)
        }));
      })
    );
  }
}
