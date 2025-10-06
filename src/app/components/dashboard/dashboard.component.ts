import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="dashboard-container">
      <header class="app-header">
        <h1>DelRio TodoList</h1>
        <p>Gerencie suas tarefas de forma eficiente</p>
      </header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .app-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 20px;
      text-align: center;
      color: white;
    }

    .app-header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 300;
    }

    .app-header p {
      margin: 5px 0 0 0;
      opacity: 0.8;
    }

    .main-content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
  }
}