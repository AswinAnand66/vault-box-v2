import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VaultService, VaultEntry } from '../../../services/vault.service';

@Component({
  selector: 'app-add-entry-dialog',
  templateUrl: './add-entry-dialog.component.html',
  styleUrls: ['./add-entry-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class AddEntryDialogComponent {
  entryForm: FormGroup;
  categories = ['Finance', 'Health', 'Personal', 'Notes'];

  constructor(
    private fb: FormBuilder,
    @Inject(VaultService) private vaultService: VaultService,
    private dialogRef: MatDialogRef<AddEntryDialogComponent>
  ) {
    this.entryForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      isPrivate: [false],
      autoDeleteDate: [null],
      unlockAfterDate: [null]
    });
  }

  onSubmit() {
    if (this.entryForm.valid) {
      this.vaultService.createEntry(this.entryForm.value).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err: Error) => {
          console.error('Error creating entry:', err);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 