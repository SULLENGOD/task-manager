import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PaginatedTasksDto } from './DTOs/paginated.dto';
import { CreateTaskDto } from './DTOs/create.dto';
import { UpdateTaskDto } from './DTOs/update.dto';
import { Task } from './tasks.schema';
import { Request } from 'express';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getTasks: jest.fn(),
            getTask: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksController).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return paginated tasks', async () => {
      const mockPaginatedTasks: PaginatedTasksDto = {
        info: { count: 10, pages: 2 },
        results: [],
      };
      const req = { userId: 'testUserId' } as Request;
      jest
        .spyOn(tasksService, 'getTasks')
        .mockResolvedValue(mockPaginatedTasks);

      const result = await tasksController.getTasks(
        '0',
        '5',
        'title',
        'asc',
        req,
      );
      expect(result).toEqual(mockPaginatedTasks);
      expect(tasksService.getTasks).toHaveBeenCalledWith(
        0,
        5,
        'title',
        'asc',
        req,
      );
    });
  });

  describe('getTask', () => {
    it('should return a task by id', async () => {
      const mockTask: Partial<Task> = {
        _id: '1',
        title: 'Test Task',
        description: 'Task description',
        endDate: new Date(),
        state: 'PENDING',
        userId: 'testUserId',
      };
      jest.spyOn(tasksService, 'getTask').mockResolvedValue(mockTask as Task);

      const result = await tasksController.getTask('1');
      expect(result).toEqual(mockTask);
      expect(tasksService.getTask).toHaveBeenCalledWith('1');
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New task description',
        endDate: new Date(),
        state: 'PENDING',
        userId: 'testUserId',
      };
      const mockTask: Partial<Task> = {
        _id: '1',
        ...createTaskDto,
      };
      const req = { userId: 'testUserId' } as Request;
      jest
        .spyOn(tasksService, 'createTask')
        .mockResolvedValue(mockTask as Task);

      const result = await tasksController.createTask(createTaskDto, req);
      expect(result).toEqual(mockTask);
      expect(tasksService.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated description',
        endDate: new Date() as any,
        state: 'IN_PROGRESS',
      };
      const mockTask: Partial<Task> = {
        _id: '1',
        title: 'Updated Task',
        description: 'Updated description',
        endDate: new Date(),
        state: 'IN_PROGRESS',
        userId: 'testUserId',
      };
      jest
        .spyOn(tasksService, 'updateTask')
        .mockResolvedValue(mockTask as Task);

      const result = await tasksController.updateTask('1', updateTaskDto);
      expect(result).toEqual(mockTask);
      expect(tasksService.updateTask).toHaveBeenCalledWith('1', updateTaskDto);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      const mockTask: Partial<Task> = {
        _id: '1',
        title: 'Test Task',
        description: 'Task description',
        endDate: new Date(),
        state: 'COMPLETED',
        userId: 'testUserId',
      };
      jest
        .spyOn(tasksService, 'deleteTask')
        .mockResolvedValue(mockTask as Task);

      const result = await tasksController.deleteTask('1');
      expect(result).toEqual(mockTask);
      expect(tasksService.deleteTask).toHaveBeenCalledWith('1');
    });
  });
});
