import { Task } from '../tasks.schema';

export class PaginatedTasksDto {
  info: {
    pages: number;
    count: number;
  };
  results: Task[];
}
