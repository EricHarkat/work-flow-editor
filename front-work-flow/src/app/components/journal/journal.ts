import { Component, inject } from '@angular/core';
import { JournalService } from '../../services/journal';

@Component({
  selector: 'app-journal',
  imports: [],
  templateUrl: './journal.html',
  styleUrl: './journal.css',
})
export class Journal {

  journalService = inject(JournalService)
}
