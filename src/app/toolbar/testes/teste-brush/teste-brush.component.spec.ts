import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteBrushComponent } from './teste-brush.component';

describe('TesteBrushComponent', () => {
  let component: TesteBrushComponent;
  let fixture: ComponentFixture<TesteBrushComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TesteBrushComponent]
    });
    fixture = TestBed.createComponent(TesteBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
