import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancasTesteComponent } from './cancas-teste.component';

describe('CancasTesteComponent', () => {
  let component: CancasTesteComponent;
  let fixture: ComponentFixture<CancasTesteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancasTesteComponent]
    });
    fixture = TestBed.createComponent(CancasTesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
