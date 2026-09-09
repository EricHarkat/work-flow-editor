import { Step } from './step.model';

export interface LogEntry {
  step: Step;
  status: 'success' | 'failure' | 'running';
  timestamp: Date;
}