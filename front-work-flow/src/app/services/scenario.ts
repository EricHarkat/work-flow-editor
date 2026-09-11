import { Injectable, signal } from '@angular/core';
import { Step } from '../models/step.model';

@Injectable({
  providedIn: 'root',
})
export class ScenarioService {
  scenario = signal<Step[]>([]);
  selectedStepId = signal<string | null>(null);

  selectStepForEdit(id: string | null) {
    this.selectedStepId.set(id);
}

  addStep(step: Step) {
    this.scenario.update((steps) => [...steps, step]);
  }

  updateStep(stepId: string, updatedStep: Partial<Step>) {
    this.scenario.update((steps) =>
      steps.map((step) => (step.id === stepId ? { ...step, ...updatedStep } : step))
    );
  }

  removeStep(stepId: string) {
    this.scenario.update((steps) => steps.filter((step) => step.id !== stepId));
  }
}
