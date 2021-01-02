/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { TaskStatusValidationPipes } from './pipes/task-status-validation-pipe';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user-decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController')
  constructor(private taskService: TasksService) {}

  @Get()
  getTask(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user:User,
  ) {
    this.logger.verbose(`User "${user.username}" retriving all tasks. Filters: ${JSON.stringify(filterDto)} `)
    return this.taskService.getAllTask(filterDto,user);
    // if (Object.keys(filterDto).length) {
    //   return this.taskService.getTaskWithFilter(filterDto);
    // } else {
    //   console.log(filterDto);
    //   return this.taskService.getAllTask();
    // }
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user:User
  ): Promise<Task> {
    return this.taskService.getTaskById(id,user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  //two ways to accept the body request, @Body() body
  createTask(
    @GetUser() user:User,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Task> {
    this.logger.verbose(`user ${user.username} creat a new Task. Date: ${JSON.stringify(createTaskDto)}`)
    return this.taskService.createTask(createTaskDto,user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user:User
  ): Promise<void> {
    return this.taskService.deleteTask(id,user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipes) status: TaskStatus,
    @GetUser() user:User
  ): Promise<Task> {
    return this.taskService.updateTask(id, status, user);
  }
}
