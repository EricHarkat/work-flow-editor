import { Component, inject, signal } from '@angular/core';
import { SimulationService } from '../../services/simulation';
import { ScenarioService } from '../../services/scenario';
import { Step } from '../../models/step.model';
import { StepList } from '../step-list/step-list';
import { StepForm } from '../step-form/step-form';
import { Journal } from '../journal/journal';

const STEP_TYPES: Step['type'][] = ['start', 'sms', 'email', 'custom', 'end'];

@Component({
  selector: 'app-simulator',
  imports: [Journal, StepForm, StepList],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css',
})
export class Simulator {

  simulationService = inject(SimulationService)
  scenarioService = inject(ScenarioService)

  importError = signal<string | null>(null);

  onLaunch() {
    this.simulationService.runSimulation();
  }

  exportScenario() {
    const data = JSON.stringify(this.scenarioService.scenario(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scenario.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  onImportFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const steps = this.parseSteps(JSON.parse(reader.result as string));
        this.scenarioService.setScenario(steps);
        this.importError.set(null);
      } catch (e) {
        this.importError.set(e instanceof Error ? e.message : 'Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private parseSteps(data: unknown): Step[] {
    if (!Array.isArray(data)) {
      throw new Error("Le fichier doit contenir un tableau d'étapes.");
    }
    return data.map((item, index) => this.parseStep(item, index));
  }

  private parseStep(item: unknown, index: number): Step {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Étape #${index + 1} invalide.`);
    }
    const { id, type, name, transitions } = item as Record<string, unknown>;
    if (typeof id !== 'string' || !id) {
      throw new Error(`Étape #${index + 1} : id manquant ou invalide.`);
    }
    if (typeof name !== 'string' || !name) {
      throw new Error(`Étape #${index + 1} : nom manquant ou invalide.`);
    }
    if (typeof type !== 'string' || !STEP_TYPES.includes(type as Step['type'])) {
      throw new Error(`Étape #${index + 1} : type invalide "${type}".`);
    }

    const t = (transitions ?? {}) as Record<string, unknown>;
    return {
      id,
      name,
      type: type as Step['type'],
      transitions: {
        onSuccess: this.parseTransitionIds(t['onSuccess'], index, 'onSuccess'),
        onFailure: this.parseTransitionIds(t['onFailure'], index, 'onFailure'),
      },
    };
  }

  private parseTransitionIds(value: unknown, index: number, field: string): string[] {
    if (value === undefined) return [];
    if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
      throw new Error(`Étape #${index + 1} : "${field}" doit être un tableau d'identifiants.`);
    }
    return value;
  }
}
