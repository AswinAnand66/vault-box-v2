import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VaultService, VaultEntry } from '../../services/vault.service';
import { AddEntryDialogComponent } from './add-entry-dialog/add-entry-dialog.component';
import { ViewEntryDialogComponent } from './view-entry-dialog/view-entry-dialog.component';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AddEntryDialogComponent,
    ViewEntryDialogComponent
  ]
})
export class VaultComponent implements OnInit {
  entries: VaultEntry[] = [];
  categories = ['Finance', 'Health', 'Personal', 'Notes'];
  loading = true;

  constructor(
    private vaultService: VaultService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.loading = true;
    this.vaultService.getEntries().subscribe({
      next: (entries: VaultEntry[]) => {
        this.entries = entries;
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading entries:', err);
        this.loading = false;
      }
    });
  }

  openAddEntryDialog() {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEntries();
      }
    });
  }

  openViewEntryDialog(entry: VaultEntry) {
    this.dialog.open(ViewEntryDialogComponent, {
      width: '500px',
      data: { entry }
    });
  }

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.vaultService.deleteEntry(id).subscribe({
        next: () => {
          this.loadEntries();
        },
        error: (err) => {
          console.error('Error deleting entry:', err);
        }
      });
    }
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'finance':
        return 'account_balance';
      case 'health':
        return 'favorite';
      case 'personal':
        return 'person';
      case 'notes':
        return 'note';
      default:
        return 'folder';
    }
  }
} 