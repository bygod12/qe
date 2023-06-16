import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImageChangeComponent } from './modal-image-change.component';

describe('ModalImageChangeComponent', () => {
  let component: ModalImageChangeComponent;
  let fixture: ComponentFixture<ModalImageChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalImageChangeComponent]
    });
    fixture = TestBed.createComponent(ModalImageChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
