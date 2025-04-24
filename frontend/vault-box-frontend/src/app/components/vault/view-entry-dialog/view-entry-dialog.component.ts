import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VaultService, VaultEntry } from '../../../services/vault.service';

@Component({
  selector: 'app-view-entry-dialog',
  templateUrl: './view-entry-dialog.component.html',
  styleUrls: ['./view-entry-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ViewEntryDialogComponent {
  entry: VaultEntry;

  constructor(
    private dialogRef: MatDialogRef<ViewEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entry: VaultEntry },
    private vaultService: VaultService
  ) {
    this.entry = data.entry;
    if (this.entry._id) {
      this.vaultService.getEntryContent(this.entry._id).subscribe({
        next: (content: string) => {
          this.entry.content = content;
        },
        error: (err: Error) => {
          console.error('Error fetching entry content:', err);
        }
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
} 