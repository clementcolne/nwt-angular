import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
export class CustomValidators {

  /**
   * Triggers error if the user chooses as username the RegExp in parameter
   * @param name RegExp
   */
  static forbiddenNameValidator(name: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = name.test(control.value);
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  /**
   * Trigger error if the passwords does not match
   * @param password password
   * @param passwordConfirmed confirmation of password
   */
  static matchPasswords(password: string, passwordConfirmed: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(password);
      const checkControl = controls.get(passwordConfirmed);

      if (checkControl?.errors && !checkControl.errors.matchPasswords) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(passwordConfirmed)?.setErrors({ matchPasswords: true });
        return { matchPasswords: true };
      } else {
        return null;
      }
    };
  }

}
