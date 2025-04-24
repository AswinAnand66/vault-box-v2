import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrustedContactService, TrustedContact } from '../../services/trusted-contact.service';

@Component({
  selector: 'app-trusted-contact',
  templateUrl: './trusted-contact.component.html',
  styleUrls: ['./trusted-contact.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class TrustedContactComponent implements OnInit {
  contactForm: FormGroup;
  currentContact: TrustedContact | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private trustedContactService: TrustedContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      unlockDelay: [7, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadCurrentContact();
  }

  loadCurrentContact() {
    this.loading = true;
    this.trustedContactService.getCurrentContact().subscribe({
      next: (contact: TrustedContact) => {
        this.currentContact = contact;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error loading contact';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading = true;
      this.trustedContactService.setContact(this.contactForm.value).subscribe({
        next: () => {
          this.loadCurrentContact();
          this.loading = false;
        },
        error: (err: Error) => {
          this.error = 'Error setting contact';
          this.loading = false;
        }
      });
    }
  }

  requestEmergencyAccess() {
    if (this.currentContact?.email) {
      this.loading = true;
      this.trustedContactService.requestEmergencyAccess().subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err: Error) => {
          this.error = 'Error requesting access';
          this.loading = false;
        }
      });
    }
  }
} 