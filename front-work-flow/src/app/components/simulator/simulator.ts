import { Component, inject } from '@angular/core';
import { SimulationService } from '../../services/simulation';
import { StepList } from '../step-list/step-list';
import { StepForm } from '../step-form/step-form';
import { Journal } from '../journal/journal';


@Component({
  selector: 'app-simulator',
  imports: [Journal, StepForm, StepList],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css',
})
export class Simulator {

  simulationService = inject(SimulationService)

  onLaunch() {
    this.simulationService.runSimulation();
  }
}
