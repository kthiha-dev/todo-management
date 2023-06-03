import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status-enum';

import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const tasks = await this.tasksRepository.getTasks(filterDto);
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const record = await this.tasksRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Record not found');
    }
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
