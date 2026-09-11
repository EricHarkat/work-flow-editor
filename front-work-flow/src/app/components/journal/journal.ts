import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { JournalService } from '../../services/journal';

@Component({
  selector: 'app-journal',
  imports: [DatePipe],
  templateUrl: './journal.html',
  styleUrl: './journal.css',
})
export class Journal {

  journalService = inject(JournalService)
}
