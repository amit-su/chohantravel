import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { firstValueFrom, tap } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalStorageService } from '../../../services/global-storage.service';
import { LoginService } from '../../../services/login.service';
import { AlertService } from '../../../services/alert.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    standalone: true
})
export class LoginComponent implements OnInit {
    userFrom?: FormGroup;
    passwordVisible = false; // Variable to control password visibility

    constructor(
        private loginService: LoginService,
        private globalStorageService: GlobalStorageService,
        private alertService: AlertService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userFrom = this.fb.group({
            username: ['', [Validators.required, Validators.min(10)]],
            password: ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible; // Toggle password visibility
    }

    async onSubmit() {
        if (this.userFrom?.valid) {
            await firstValueFrom(
                this.loginService.login(this.userFrom.value).pipe(
                    tap(
                        (res) => {
                            if (res) {
                                this.globalStorageService.set('token', res.token, true);
                                this.globalStorageService.set('userId', res.id, true);
                                this.globalStorageService.set('username', res.username, true);
                                this.router.navigate(['/']);
                            }
                        },
                        (error) => {
                            this.alertService.warning(error.error.message || 'network error');
                        }
                    )
                )
            );
        } else {
            this.userFrom?.markAllAsTouched();
        }
    }
}
