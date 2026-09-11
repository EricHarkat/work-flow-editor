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

  hasEndStep(): boolean {
    return this.scenarioService.scenario().some((s) => s.type === 'end');
  }

  getStepName(id: string): string {
    const step = this.scenarioService.scenario().find((s) => s.id === id);
    return step ? step.name : '(étape supprimée)';
  }
}
