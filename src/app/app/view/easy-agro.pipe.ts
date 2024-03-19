import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'easyAgro'
})
export class EasyAgroPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
