import {
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { TaskStatus } from '../task.status.enum';

export class TaskStatusValidationPipes implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any) {
    //metadata: ArgumentMetadata
    console.log('value', value);
    // console.log(metadata);

    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`${value} is invalid status`);
    }
    return value;
  }

  private isValidStatus(status: any) {
    const id = this.allowedStatus.indexOf(status);

    return id !== -1;
  }
}
