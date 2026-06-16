import { Controller, Get, Delete, Post, Param, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  getStats() {
    return this.adminService.getStats();
  }

  @Get('employees')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  getAllEmployees() {
    return this.adminService.getAllEmployees();
  }

  @Delete('employees/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @HttpCode(204)
  deleteEmployee(@Param('id') id: string) {
    return this.adminService.deleteEmployee(id);
  }

  @Post('seed-admin')
  seedAdmin() {
    return this.adminService.seedAdmin();
  }
}
