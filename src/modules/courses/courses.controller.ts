import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CourseQueryDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './dto/course.dto';
import { AuthGuard } from '../auth/auth.gaurd';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }
  // @Get()
  // findAll(
  //   @Query('offset') offset = '0',
  //   @Query('limit') limit = '10',
  //   @Query('sortColumn') sortColumn = '',
  //   @Query('sortDirection') sortDirection = '',
  // ) {
  //   const parsedOffset = Math.max(Number(offset), 0);
  //   const parsedLimit = Math.min(Math.max(Number(limit), 1), 100);
  //   return this.coursesService.findAll(parsedOffset, parsedLimit,sortColumn,sortDirection);
  // }
  @Get()
  findAll(@Query() query: CourseQueryDto) {
    return this.coursesService.findAll(
      query.offset,
      query.limit,
      query.sortColumn,
      query.sortDirection,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
