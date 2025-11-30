import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formulariopersona } from './formulariopersona';

describe('Formulariopersona', () => {
  let component: Formulariopersona;
  let fixture: ComponentFixture<Formulariopersona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formulariopersona]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formulariopersona);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
