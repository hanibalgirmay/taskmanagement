import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { DeleteResult } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  // private task: Task[] = [];
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`task ${id} id not found`);
    }

    return found;
  }

  async getAllTask(filterDtoL: GetTaskFilterDto, user: User): Promise<Task[]> {
    // return this.task;
    return this.taskRepository.getTasks(filterDtoL, user);
  }

  // getTaskWithFilter(filterSto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterSto;

  //   let task = this.getAllTask();

  //   if (status) {
  //     task = task.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     task = task.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return task;
  // }

  // getTaskById(id: string): Task {
  //   const data = this.task.find(task => task.id === id);

  //   if (!data) {
  //     throw new NotFoundException(`${id} not found`);
  //   }

  //   return data;
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;

  //   const task: Task = {
  //     id: uuid4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.task.push(task);
  //   return task;
  // }

  async deleteTask(
    id: number,
    user:User
  ): Promise<void> {
    const result = await this.taskRepository.delete({id,userId: user.id});

    if (result.affected == 0) {
      throw new NotFoundException(`${id} not found`);
    }
    // this.task = this.task.filter(tasks => tasks.id !== returnData.id);
  }

  async updateTask(
    id: number, status: TaskStatus,
    user:User
  ): Promise<Task> {
    const task = await this.getTaskById(id,user);
    task.status = status;
    await task.save();
    return task;
  }

  // updateTask(id: string): Task {
  //   const u = this.task.findIndex(task => task.id === id);
  //   this.task[u].status = TaskStatus.IN_PROGRESS;
  //   return this.task[u];
  // }
}
