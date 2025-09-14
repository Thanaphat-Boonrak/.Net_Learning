import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const today = new Date();
    const BirthOfDate = new Date(value);
    let age = today.getFullYear() - BirthOfDate.getFullYear();
    const monthDiff = today.getMonth() - BirthOfDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < BirthOfDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
