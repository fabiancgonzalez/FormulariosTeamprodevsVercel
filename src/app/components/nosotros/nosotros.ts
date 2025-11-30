import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [],
  template: `
    <div class="nosotros-container">
      <h1>Sobre Nosotros</h1>
      <div class="content">
        <p>Bienvenidos a <strong>ProDev</strong>, tu plataforma de gestión de personas y mascotas.</p>
        <p>Somos un equipo dedicado a crear soluciones tecnológicas innovadoras que facilitan la administración y seguimiento de información importante.</p>
        
        <h2>Nuestra Misión</h2>
        <p>Proporcionar herramientas digitales eficientes y fáciles de usar para la gestión de datos de personas y sus mascotas.</p>
        
        <h2>Características</h2>
        <ul>
          <li>Registro y gestión de personas</li>
          <li>Registro y gestión de mascotas</li>
          <li>Reportes detallados</li>
          <li>Interfaz intuitiva y moderna</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .nosotros-container {
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #667eea;
      text-align: center;
      margin-bottom: 30px;
      font-size: 36px;
    }

    .content {
      line-height: 1.8;
    }

    h2 {
      color: #764ba2;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    p {
      color: #333;
      font-size: 16px;
      margin-bottom: 15px;
    }

    ul {
      color: #333;
      font-size: 16px;
      margin-left: 20px;
    }

    li {
      margin-bottom: 10px;
    }

    strong {
      color: #667eea;
      font-weight: bold;
    }
  `]
})
export class Nosotros {
}
