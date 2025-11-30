import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fecha_creacion?: string;
}

export interface Mascota {
  id?: number;
  nombre: string;
  tipo: string;
  raza?: string;
  edad?: number;
  id_persona?: number;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ========== PERSONAS ==========

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/personas`);
  }

  getPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/personas/${id}`);
  }

  crearPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/personas`, persona);
  }

  actualizarPersona(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/personas/${id}`, persona);
  }

  eliminarPersona(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/personas/${id}`);
  }

  // ========== MASCOTAS ==========

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/mascotas`);
  }

  getMascotasDePersona(idPersona: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/personas/${idPersona}/mascotas`);
  }

  crearMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.apiUrl}/mascotas`, mascota);
  }

  actualizarMascota(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/mascotas/${id}`, mascota);
  }

  eliminarMascota(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mascotas/${id}`);
  }

  // ========== REPORTES ==========

  getPersonasConMascotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reporte/personas-mascotas`);
  }
}
