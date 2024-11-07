import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.schema';
import { CreateTaskDto } from './DTOs/create.dto';
import { PaginatedTasksDto } from './DTOs/paginated.dto';
import { UpdateTaskDto } from './DTOs/update.dto';
import { Request } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query('page') page: string = '0',
    @Query('size') size: string = '5',
    @Query('sort') sort: string = 'title',
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Req() req: Request,
  ): Promise<PaginatedTasksDto> {
    return this.tasksService.getTasks(
      parseInt(page),
      parseInt(size),
      sort,
      order,
      req,
    );
  }

  @Get(':id')
  getTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTask(id);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    createTaskDto.userId = req.userId;
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }
}
