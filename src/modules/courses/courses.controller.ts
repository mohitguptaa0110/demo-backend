import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';
import { AuthGuard } from '../auth/auth.gaurd';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    this.coursesService.create(createCourseDto);
  }
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }
}
