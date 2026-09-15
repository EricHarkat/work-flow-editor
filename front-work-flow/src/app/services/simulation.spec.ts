import { TestBed } from '@angular/core/testing';

import { SimulationService } from './simulation';
import { ScenarioService } from './scenario';
import { JournalService } from './journal';
import { Step } from '../models/step.model';

function makeStep(overrides: Partial<Step> = {}): Step {
  return {
    id: 'step',
    type: 'custom',
    name: 'Step',
    transitions: {},
    ...overrides,
  };
}

describe('SimulationService', () => {
  let service: SimulationService;
  let scenarioService: ScenarioService;
  let journalService: JournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationService);
    scenarioService = TestBed.inject(ScenarioService);
    journalService = TestBed.inject(JournalService);

    // simulateStep carries a real 1s delay; mock it so tests stay fast and
    // deterministic, and control the outcome per test.
    vi.spyOn(service, 'simulateStep').mockResolvedValue('success');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('runSimulation', () => {
    it('sets an error and logs nothing when there is no start step', async () => {
      scenarioService.setScenario([makeStep({ id: 'a', type: 'sms' })]);

      await service.runSimulation();

      expect(service.simulationError()).not.toBeNull();
      expect(journalService.logs()).toEqual([]);
    });

    it('clears a previous error once a start step exists', async () => {
      scenarioService.setScenario([makeStep({ id: 'a', type: 'sms' })]);
      await service.runSimulation();
      expect(service.simulationError()).not.toBeNull();

      scenarioService.setScenario([makeStep({ id: 'start', type: 'start' })]);
      await service.runSimulation();

      expect(service.simulationError()).toBeNull();
    });

    it('executes the chain from start and logs running then the result for each step', async () => {
      scenarioService.setScenario([
        makeStep({ id: 'start', type: 'start', transitions: { onSuccess: ['mid'] } }),
        makeStep({ id: 'mid', type: 'sms', transitions: { onSuccess: ['end'] } }),
        makeStep({ id: 'end', type: 'end' }),
      ]);

      await service.runSimulation();

      const entries = journalService.logs().map((l) => `${l.step.id}:${l.status}`);
      expect(entries).toEqual([
        'start:running',
        'start:success',
        'mid:running',
        'mid:success',
        'end:running',
        'end:success',
      ]);
    });

    it('follows onFailure transitions when the simulated step fails', async () => {
      vi.spyOn(service, 'simulateStep').mockResolvedValue('failure');
      scenarioService.setScenario([
        makeStep({
          id: 'start',
          type: 'start',
          transitions: { onSuccess: ['ok'], onFailure: ['fallback'] },
        }),
        makeStep({ id: 'ok', type: 'sms' }),
        makeStep({ id: 'fallback', type: 'custom' }),
      ]);

      await service.runSimulation();

      const ids = journalService.logs().map((l) => l.step.id);
      expect(ids).toContain('fallback');
      expect(ids).not.toContain('ok');
    });

    it('executes parallel branches for multiple transitions', async () => {
      scenarioService.setScenario([
        makeStep({ id: 'start', type: 'start', transitions: { onSuccess: ['a', 'b'] } }),
        makeStep({ id: 'a', type: 'sms' }),
        makeStep({ id: 'b', type: 'sms' }),
      ]);

      await service.runSimulation();

      const ids = journalService.logs().map((l) => l.step.id);
      expect(ids.filter((id) => id === 'a')).toHaveLength(2);
      expect(ids.filter((id) => id === 'b')).toHaveLength(2);
    });

    it('stops a path that loops back to an already-visited step', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      scenarioService.setScenario([
        makeStep({ id: 'start', type: 'start', transitions: { onSuccess: ['a'] } }),
        makeStep({ id: 'a', type: 'sms', transitions: { onSuccess: ['start'] } }),
      ]);

      await service.runSimulation();

      const startEntries = journalService.logs().filter((l) => l.step.id === 'start');
      expect(startEntries).toHaveLength(2);
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeStep', () => {
    it('does nothing when the step id does not exist in the scenario', async () => {
      await service.executeStep('missing', []);
      expect(journalService.logs()).toEqual([]);
    });
  });
});
