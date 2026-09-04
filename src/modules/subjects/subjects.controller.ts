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
import { SubjectsService } from './subjects.service';
import {
  CreateCurriculumDto,
  SubjectQueryDto,
  UpdateSubjectDto,
} from './dto/subjects.dto';
import { AuthGuard } from '../auth/auth.gaurd';

@Controller('subjects')
@UseGuards(AuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll(@Query() query: SubjectQueryDto) {
    return this.subjectsService.findAll(query);
  }

  @Get('course/:courseId')
  findByCourse(
    @Param('courseId', ParseIntPipe)
    courseId: number,
  ) {
    return this.subjectsService.findByCourse(courseId);
  }

  @Post('curriculum')
  createCurriculum(@Body() dto: CreateCurriculumDto) {
    return this.subjectsService.createCurriculum(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.subjectsService.remove(id);
  }
}
