import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TodosService } from '../services/todos.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { CreateTodoDto, UpdateTodoDto, TodoFilter } from '../interfaces/todo.interface';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Request() req: any, @Body() createTodoDto: CreateTodoDto) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const todo = await this.todosService.create(userId, createTodoDto);
      return { success: true, data: todo, message: 'Todo başarıyla oluşturuldu' };
    } catch (error) {
      return { success: false, message: 'Todo oluşturulamadı', error: error.message };
    }
  }

  @Get()
  async findAll(@Request() req: any, @Query('status') status?: string) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const filter: TodoFilter = {
        user_id: userId,
        status: (status as any) || 'all'
      };
      const todos = await this.todosService.findAll(filter);
      return { success: true, data: todos };
    } catch (error) {
      return { success: false, message: 'Todolar yüklenemedi', error: error.message };
    }
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const todo = await this.todosService.findOne(+id, userId);
      if (!todo) {
        return { success: false, message: 'Todo bulunamadı' };
      }
      return { success: true, data: todo };
    } catch (error) {
      return { success: false, message: 'Todo yüklenemedi', error: error.message };
    }
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const todo = await this.todosService.update(+id, userId, updateTodoDto);
      if (!todo) {
        return { success: false, message: 'Todo bulunamadı' };
      }
      return { success: true, data: todo, message: 'Todo başarıyla güncellendi' };
    } catch (error) {
      return { success: false, message: 'Todo güncellenemedi', error: error.message };
    }
  }

  @Put(':id/toggle')
  async toggleStatus(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const todo = await this.todosService.toggleStatus(+id, userId);
      if (!todo) {
        return { success: false, message: 'Todo bulunamadı' };
      }
      return { success: true, data: todo, message: 'Todo durumu güncellendi' };
    } catch (error) {
      return { success: false, message: 'Todo durumu güncellenemedi', error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const todo = await this.todosService.softDelete(+id, userId);
      if (!todo) {
        return { success: false, message: 'Todo bulunamadı' };
      }
      return { success: true, data: todo, message: 'Todo silindi' };
    } catch (error) {
      return { success: false, message: 'Todo silinemedi', error: error.message };
    }
  }

  @Put(':id/soft-delete')
  async softDelete(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    if (!userId) {
      return { success: false, message: 'Kullanıcı kimliği bulunamadı' };
    }

    try {
      const todo = await this.todosService.softDelete(+id, userId);
      if (!todo) {
        return { success: false, message: 'Todo bulunamadı' };
      }
      return { success: true, data: todo, message: 'Todo silindi' };
    } catch (error) {
      return { success: false, message: 'Todo silinemedi', error: error.message };
    }
  }
}
