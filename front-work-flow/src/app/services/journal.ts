import { Injectable, signal } from '@angular/core';
import { LogEntry } from '../models/log-entry.model';
import { Step } from '../models/step.model';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  logs = signal<LogEntry[]>([]);

  addEntry(step: Step, status: 'success' | 'failure' | 'running') {
  this.logs.update(current => [...current, { step, status, timestamp: new Date() }]);
  }
}
