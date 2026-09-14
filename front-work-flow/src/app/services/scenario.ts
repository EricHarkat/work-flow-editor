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

  setScenario(steps: Step[]) {
    this.selectedStepId.set(null);
    this.scenario.set(steps);
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
    this.scenario.update((steps) =>
      steps
        .filter((step) => step.id !== stepId)
        .map((step) => ({
          ...step,
          transitions: {
            onSuccess: step.transitions.onSuccess?.filter((id) => id !== stepId),
            onFailure: step.transitions.onFailure?.filter((id) => id !== stepId),
          },
        }))
    );
  }
}
