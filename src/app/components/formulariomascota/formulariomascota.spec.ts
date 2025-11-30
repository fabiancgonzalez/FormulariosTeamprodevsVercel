import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formulariomascota } from './formulariomascota';

describe('Formulariomascota', () => {
  let component: Formulariomascota;
  let fixture: ComponentFixture<Formulariomascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formulariomascota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formulariomascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
