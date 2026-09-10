import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Simulator } from './components/simulator/simulator';

@Component({
  selector: 'app-root',
  imports: [Simulator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-work-flow');
}
