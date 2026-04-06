import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Card Component with header, body, and footer slots
 * Provides consistent styling and spacing across the application
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title: string | null = null;
  @Input() subtitle: string | null = null;
  @Input() hoverable = false;
  @Input() bordered = true;
  @Input() borderColor: 'gray' | 'blue' | 'red' = 'gray';

  get borderClass(): string {
    const colors: Record<string, string> = {
      gray: 'border-gray-200',
      blue: 'border-blue-200',
      red: 'border-red-200',
    };
    return this.bordered ? `border ${colors[this.borderColor]}` : '';
  }

  get hoverClass(): string {
    return this.hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  }
}
