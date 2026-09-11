import { inject, Injectable, signal } from '@angular/core';
import { ScenarioService } from './scenario';
import { JournalService } from './journal';
import { Step } from '../models/step.model';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private scenarioService = inject(ScenarioService);
  private journalService = inject(JournalService);

  simulationError = signal<string | null>(null);

simulateStep(step: Step): Promise<'success' | 'failure'> {
  return new Promise((resolve) => {
    let status: 'success' | 'failure';
    setTimeout(() => {
      switch (step.type) {
        case 'sms':
        case 'start':
        case 'custom':
        case 'end':
          status = 'success';
          break;
        case 'email':
          status = Math.random() > 0.5 ? 'success' : 'failure';
          break;
        default:
          status = 'success';
      }
      resolve(status);
    }, 1000);
  });
}

async executeStep(stepId: string, steps: Step[], visited: Set<string> = new Set()): Promise<void> {
  if (visited.has(stepId)) {
    console.warn(`Boucle détectée sur l'étape "${stepId}", exécution de ce chemin arrêtée.`);
    return;
  }
  const step = steps.find((s) => s.id === stepId);
  if (!step) return;
  const pathVisited = new Set(visited).add(stepId);

  this.journalService.addEntry(step, 'running');
  const result = await this.simulateStep(step);
  this.journalService.addEntry(step, result);

  let nextSteps: string[] = [];
  if (result === 'success') {
    nextSteps = step.transitions.onSuccess || [];
  } else {
    nextSteps = step.transitions.onFailure || [];
  }

  await Promise.all(nextSteps.map((nextStepId) => this.executeStep(nextStepId, steps, pathVisited)));
}

  async runSimulation() {
  this.simulationError.set(null);
  const steps = this.scenarioService.scenario();
  const startStep = steps.find((s) => s.type === 'start');
  if (!startStep) {
    this.simulationError.set("Aucune étape de départ (type 'start') trouvée. Ajoutez-en une pour lancer la simulation.");
    return;
  }
  return await this.executeStep(startStep.id, steps);
}
}