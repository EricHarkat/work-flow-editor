import { Component,inject,effect,signal } from '@angular/core';
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
  scenarioService = inject(ScenarioService);

  selectedSuccessIds = signal<string[]>([]);
  selectedFailureIds = signal<string[]>([]);

  public typeList: Step['type'][] = ['start', 'sms', 'email', 'custom', 'end'];
  stepForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl('sms', Validators.required),
  });

  constructor() {
    effect(() => {
      const id = this.scenarioService.selectedStepId();
      if (id === null) return;
      const step = this.scenarioService.scenario().find(s => s.id === id);
      if (step) {
        this.stepForm.patchValue({ name: step.name, type: step.type });
      }
    });
  }

  toggleSuccess(id: string){
    const currentIds = this.selectedSuccessIds();
    if (currentIds.includes(id)) {
      this.selectedSuccessIds.set(currentIds.filter((v) => v !== id));
    } else {
      this.selectedSuccessIds.set([...currentIds, id]);
    }
  }

  toggleFailure(id: string){
    const currentIds = this.selectedFailureIds();
    if (currentIds.includes(id)) {
      this.selectedFailureIds.set(currentIds.filter((v) => v !== id));
    } else {
      this.selectedFailureIds.set([...currentIds, id]);
    }
  }

  onSubmit() {
    if (this.stepForm.valid) {
      const editingId = this.scenarioService.selectedStepId();
      if (editingId !== null) {
        this.scenarioService.updateStep(editingId, {
          name: this.stepForm.value.name || '',
          type: this.stepForm.value.type as Step['type'],
          transitions: {
            onSuccess: this.selectedSuccessIds(),
            onFailure: this.selectedFailureIds(),
          },
        });
        this.scenarioService.selectedStepId.set(null);
        this.stepForm.reset()
        this.selectedSuccessIds.set([])
        this.selectedFailureIds.set([])
        return;
      }else {
      let step: Step = {
      id: crypto.randomUUID(),
      name: this.stepForm.value.name || '',
      type: this.stepForm.value.type as Step['type'],
      transitions: {
        onSuccess: this.selectedSuccessIds(),
        onFailure: this.selectedFailureIds(),
      },
      }
      console.log('Form Submitted!', this.stepForm.value);
      this.scenarioService.addStep(step);
      this.stepForm.reset()
      this.selectedSuccessIds.set([])
      this.selectedFailureIds.set([])
    };
    } else {
      console.log('Form is invalid');
    }
    
  }
}