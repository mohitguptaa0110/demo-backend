import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/entity/course.model';
import { CreateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
  ) {}

  //CREATE
  async create(createCourseDto: CreateCourseDto) {
    const { name, code, duration, description } = createCourseDto;
    const existingCourse = await this.courseModel.findOne({
      where: {
        code: createCourseDto.code,
      },
    });

    if (existingCourse) {
      throw new ConflictException('Course code already exists');
    }

    return this.courseModel.create({
      name,
      code,
      duration,
      description,
    });
  }

  //READ ALL
  async findAll() {
    return this.courseModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }
}
