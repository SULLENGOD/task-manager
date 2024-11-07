import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './tasks.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './DTOs/create.dto';
import { PaginatedTasksDto } from './DTOs/paginated.dto';
import { UpdateTaskDto } from './DTOs/update.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getTasks(
    page: number = 0,
    size: number = 5,
    sort: string = 'title',
    order: 'asc' | 'desc' = 'asc',
    req,
  ): Promise<PaginatedTasksDto> {
    const sortOrder = order === 'asc' ? 1 : -1;
    const userId = req.userId;

    const count = await this.taskModel.countDocuments();
    const tasks = await this.taskModel
      .find()
      .where({ userId: userId })
      .sort({ [sort]: sortOrder })
      .skip(page * size)
      .limit(size)
      .exec();

    const totalPages = Math.ceil(count / size);

    return {
      info: {
        count,
        pages: totalPages,
      },
      results: tasks,
    };
  }

  async getTask(id: string): Promise<Task> {
    return this.taskModel.findById(id);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) throw new NotFoundException(`Task with ${id} not found`);

    return updatedTask;
  }

  async deleteTask(id: string): Promise<Task> {
    const deletedTask = this.taskModel.findByIdAndDelete(id);

    if (!deletedTask) throw new NotFoundException(`Task with ${id} not found`);

    return deletedTask;
  }
}
