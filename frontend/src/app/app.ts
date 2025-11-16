import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  // Ya no necesitamos 'styleUrl' porque usaremos Tailwind
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  

}
