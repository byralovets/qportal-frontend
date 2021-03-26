import { Component, OnInit } from '@angular/core';
import {ForgotPasswordService} from '../../services/forgot-password/forgot-password.service';
import {TokenStorageService} from '../../services/token-storage/token-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import {log} from 'util';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: any = {};
  token: string | null = null;
  isPasswordCorrect: boolean = true;
  isConfirmationCorrect: boolean = true;

  constructor(private forgotPasswordService: ForgotPasswordService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.router.navigate(['']);
      return;
    }

    log('Token is ' + this.token);
  }

  disableSubmitButton() {
    document.getElementById('submit')?.classList.add('disabled');
  }

  enableSubmitButton() {
    document.getElementById('submit')?.classList.remove('disabled');
  }

  onSubmit() {
    if (!this.token) return;
    this.forgotPasswordService.resetPassword(this.form, this.token).subscribe(
        (data) => {
          log('signupData' + data);
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);
          this.router.navigate([''])
        }
    );
  }

  onPasswordChange(password: NgModel, passwordConfirm: NgModel) {
    if (!password.value) {
      this.disableSubmitButton();

      if (passwordConfirm.value) {
        this.isConfirmationCorrect = false;
        document.getElementById('passwordConfirm')?.classList.add('is-invalid');
        document.getElementById('passwordConfirm')?.classList.remove('is-valid');
      } else {
        // this.isConfirmationCorrect = false;
        document.getElementById('passwordConfirm')?.classList.remove('is-valid');
        document.getElementById('passwordConfirm')?.classList.remove('is-invalid');
      }

      document.getElementById('password')?.classList.remove('is-valid');
      document.getElementById('password')?.classList.remove('is-invalid');
      return;
    }

    this.isPasswordCorrect = password.value.length > 5;

    if (this.isPasswordCorrect) {
      document.getElementById('password')?.classList.add('is-valid');
      document.getElementById('password')?.classList.remove('is-invalid');
    } else {
      document.getElementById('password')?.classList.add('is-invalid');
      document.getElementById('password')?.classList.remove('is-valid');
    }

    if (password.value == passwordConfirm.value) {
      this.enableSubmitButton()
      this.isConfirmationCorrect = true;
      document.getElementById('passwordConfirm')?.classList.add('is-valid');
      document.getElementById('passwordConfirm')?.classList.remove('is-invalid');
    } else {
      this.disableSubmitButton();
      this.isConfirmationCorrect = false;
      document.getElementById('passwordConfirm')?.classList.remove('is-valid');
      document.getElementById('passwordConfirm')?.classList.add('is-invalid');
    }

    this.updateSubmitButtonStatus();
  }

  updateSubmitButtonStatus() {
    if (this.isPasswordCorrect && this.isConfirmationCorrect && this.form.password && this.form.passwordConfirm) {
      this.enableSubmitButton();
    } else {
      this.disableSubmitButton();
    }
  }

}
