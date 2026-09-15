import { TestBed } from '@angular/core/testing';

import { ScenarioService } from './scenario';
import { Step } from '../models/step.model';

function makeStep(overrides: Partial<Step> = {}): Step {
  return {
    id: 'step-1',
    type: 'sms',
    name: 'Step 1',
    transitions: {},
    ...overrides,
  };
}

describe('ScenarioService', () => {
  let service: ScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScenarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts with an empty scenario and no selected step', () => {
    expect(service.scenario()).toEqual([]);
    expect(service.selectedStepId()).toBeNull();
  });

  describe('addStep', () => {
    it('appends the step to the scenario', () => {
      const step = makeStep();
      service.addStep(step);
      expect(service.scenario()).toEqual([step]);
    });

    it('keeps existing steps when adding a new one', () => {
      service.addStep(makeStep({ id: 'a' }));
      service.addStep(makeStep({ id: 'b' }));
      expect(service.scenario().map((s) => s.id)).toEqual(['a', 'b']);
    });
  });

  describe('updateStep', () => {
    it('merges the update into the matching step', () => {
      service.addStep(makeStep({ id: 'a', name: 'Old name' }));
      service.updateStep('a', { name: 'New name' });
      expect(service.scenario()[0].name).toBe('New name');
    });

    it('does nothing when the id is not found', () => {
      const step = makeStep({ id: 'a' });
      service.addStep(step);
      service.updateStep('missing', { name: 'Should not apply' });
      expect(service.scenario()).toEqual([step]);
    });
  });

  describe('removeStep', () => {
    it('removes the matching step', () => {
      service.addStep(makeStep({ id: 'a' }));
      service.addStep(makeStep({ id: 'b' }));
      service.removeStep('a');
      expect(service.scenario().map((s) => s.id)).toEqual(['b']);
    });

    it('strips the removed id from other steps transitions', () => {
      service.addStep(makeStep({ id: 'a', transitions: { onSuccess: ['b'], onFailure: ['b'] } }));
      service.addStep(makeStep({ id: 'b' }));

      service.removeStep('b');

      const remaining = service.scenario()[0];
      expect(remaining.transitions.onSuccess).toEqual([]);
      expect(remaining.transitions.onFailure).toEqual([]);
    });
  });

  describe('setScenario', () => {
    it('replaces the whole scenario', () => {
      service.addStep(makeStep({ id: 'a' }));
      const replacement = [makeStep({ id: 'z' })];

      service.setScenario(replacement);

      expect(service.scenario()).toEqual(replacement);
    });

    it('resets the selected step id', () => {
      service.addStep(makeStep({ id: 'a' }));
      service.selectStepForEdit('a');

      service.setScenario([makeStep({ id: 'z' })]);

      expect(service.selectedStepId()).toBeNull();
    });
  });

  describe('selectStepForEdit', () => {
    it('sets the selected step id', () => {
      service.selectStepForEdit('a');
      expect(service.selectedStepId()).toBe('a');
    });

    it('clears the selection with null', () => {
      service.selectStepForEdit('a');
      service.selectStepForEdit(null);
      expect(service.selectedStepId()).toBeNull();
    });
  });
});
