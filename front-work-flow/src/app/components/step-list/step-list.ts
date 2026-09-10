import { Component, inject } from '@angular/core';
import { ScenarioService } from '../../services/scenario';

@Component({
  selector: 'app-step-list',
  imports: [],
  templateUrl: './step-list.html',
  styleUrl: './step-list.css',
})
export class StepList {
  scenarioService = inject(ScenarioService)

  getStepName(id: string): string {
    const step = this.scenarioService.scenario().find((s) => s.id === id);
    return step ? step.name : '(étape supprimée)';
  }
}
