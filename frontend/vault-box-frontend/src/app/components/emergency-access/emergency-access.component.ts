import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrustedContactService } from '../../services/trusted-contact.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-emergency-access',
  templateUrl: './emergency-access.component.html',
  styleUrls: ['./emergency-access.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ]
})
export class EmergencyAccessComponent {
  accessForm: FormGroup;
  entries: any[] = [];
  loading = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private trustedContactService: TrustedContactService
  ) {
    this.accessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.accessForm.valid) {
      this.loading = true;
      const { email, verificationCode } = this.accessForm.value;

      this.trustedContactService.getEmergencyAccess({ email, verificationCode }).subscribe({
        next: (entries) => {
          this.entries = entries;
          this.loading = false;
          this.error = '';
        },
        error: (err) => {
          this.error = err.error.message || 'Error accessing vault';
          this.loading = false;
        }
      });
    }
  }
} 