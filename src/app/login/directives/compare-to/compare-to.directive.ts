import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appCompareTo]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompareToDirective, multi: true}]

})
export class CompareToDirective implements Validator {
  @Input() appCompareTo: any  ;
  constructor(private element: ElementRef) {}

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value == this.appCompareTo.value ? null : {'compareTo': true };
  }
}
