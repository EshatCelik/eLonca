import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAll().subscribe({
      next: (data: any) => {
        this.users = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.users = [];
        this.isLoading = false;
      }
    });
  }
}