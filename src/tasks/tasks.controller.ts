import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a paginated list of tasks.',
    schema: {
      example: {
        results: [
          {
            id: '1234567890abcdef12345678',
            title: 'Sample Task',
            description: 'Sample description',
            endDate: '2024-12-31T23:59:59.999Z',
            state: 'PENDING',
            userId: '1234567890abcdef12345678',
            createdAt: '2024-11-07T12:00:00.000Z',
            updatedAt: '2024-11-07T12:00:00.000Z',
          },
        ],
        info: {
          pages: 0,
          count: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid pagination parameters.',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a single task by ID.',
    schema: {
      example: {
        id: '1234567890abcdef12345678',
        title: 'Sample Task',
        description: 'Sample description',
        endDate: '2024-12-31T23:59:59.999Z',
        state: 'PENDING',
        userId: '1234567890abcdef12345678',
        createdAt: '2024-11-07T12:00:00.000Z',
        updatedAt: '2024-11-07T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found.',
  })
  getTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTask(id);
  }

  @Post()
  @ApiBody({
    schema: {
      example: {
        title: 'New Task',
        description: 'Description',
        endDate: '2024-12-31T23:59:59.999Z',
        state: 'PENDING',
        userId: '1234567890abcdef12345678',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The task has been successfully created.',
    schema: {
      example: {
        id: '1234567890abcdef12345678',
        title: 'New Task',
        description: 'Description',
        endDate: '2024-12-31T23:59:59.999Z',
        state: 'PENDING',
        userId: '1234567890abcdef12345678',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for task creation.',
  })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    createTaskDto.userId = req.userId;
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        title: 'Updated Task',
        description: 'Updated description',
        endDate: '2024-12-31T23:59:59.999Z',
        state: 'IN_PROGRESS',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully updated.',
    schema: {
      example: {
        id: '1234567890abcdef12345678',
        title: 'Updated Task',
        description: 'Updated description',
        endDate: '2024-12-31T23:59:59.999Z',
        state: 'IN_PROGRESS',
        userId: '1234567890abcdef12345678',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found for update.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for task update.',
  })
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully deleted.',
    schema: {
      example: {
        id: '1234567890abcdef12345678',
        title: 'Deleted Task',
        description: 'Deleted description',
        endDate: '2024-12-31T23:59:59.999Z',
        state: 'COMPLETED',
        userId: '1234567890abcdef12345678',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found for deletion.',
  })
  deleteTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }
}
