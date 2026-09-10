import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepForm } from './step-form';

describe('StepForm', () => {
  let component: StepForm;
  let fixture: ComponentFixture<StepForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StepForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
