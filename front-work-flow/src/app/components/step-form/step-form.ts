import { Component,inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Step } from '../../models/step.model';
import { ScenarioService } from '../../services/scenario';

@Component({
  selector: 'app-step-form',
  imports: [ReactiveFormsModule],
  templateUrl: './step-form.html',
  styleUrl: './step-form.css',
})
export class StepForm {
  private scenarioService = inject(ScenarioService)

  public typeList: Step['type'][] = ['start', 'sms', 'email', 'custom', 'end'];
  stepForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl('sms', Validators.required),
  });

  onSubmit() {
    if (this.stepForm.valid) {
      let step: Step = {
      id: crypto.randomUUID(),
      name: this.stepForm.value.name || '',
      type: this.stepForm.value.type as Step['type'],
      transitions: {},
    };
      console.log('Form Submitted!', this.stepForm.value);
      this.scenarioService.addStep(step);
    } else {
      console.log('Form is invalid');
    }
  }
}