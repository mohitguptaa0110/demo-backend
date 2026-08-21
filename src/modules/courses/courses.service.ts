import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/entity/course.model';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

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
  async findAll(offset: number, limit: number) {
    const { rows, count } = await this.courseModel.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
    });
    return {
      data: rows,
      total: count,
    };
  }

  // READ ONE
  async findOne(id: number) {
    const course = await this.courseModel.findByPk(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  // UPDATE
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    // const { name, code, duration, description } = updateCourseDto;
    const course = await this.findOne(id);

    await course.update(updateCourseDto);

    return course;
  }

  // SOFT DELETE
  async remove(id: number) {
    const course = await this.findOne(id);

    await course.destroy();

    return {
      message: 'Course deleted successfully',
    };
  }
}
