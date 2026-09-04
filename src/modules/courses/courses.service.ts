import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/entity/course.entity';
import {
  CourseQueryDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './dto/course.dto';
import { Op } from 'sequelize';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course)
    private readonly courseRepository: typeof Course,
  ) {}

  //CREATE
  async create(createCourseDto: CreateCourseDto) {
    const { name, code, duration, description } = createCourseDto;
    const existingCourse = await this.courseRepository.findOne({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: name.trim(),
            },
          },
          {
            code: {
              [Op.iLike]: code.trim(),
            },
          },
        ],
      },
    });

    if (existingCourse) {
      if (existingCourse.name.toLowerCase() === name.trim().toLowerCase()) {
        throw new ConflictException('Course name already exists');
      }

      throw new ConflictException('Course code already exists');
    }

    return this.courseRepository.create({
      name: name.trim(),
      code: code.trim(),
      duration,
      description,
    });
  }

  //READ ALL
  async findAll(query: CourseQueryDto) {
    const { offset, limit, search, sortColumn, sortDirection } = query;

    const allowedColumns = ['name', 'code', 'duration'];

    const column = allowedColumns.includes(sortColumn ?? '')
      ? sortColumn!
      : 'name';

    const direction = sortDirection === 'DESC' ? 'DESC' : 'ASC';
    // Search condition
    const where: any = {};

    if (search?.trim()) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search.trim()}%`,
          },
        },
        {
          code: {
            [Op.iLike]: `%${search.trim()}%`,
          },
        },
      ];
    }

    const { rows, count } = await this.courseRepository.findAndCountAll({
      where,
      offset,
      limit,
      order: [[column, direction]],
      logging: true,
    });

    return {
      data: rows,
      total: count,
    };
  }

  // READ ONE
  async findOne(id: number) {
    const course = await this.courseRepository.findByPk(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  // UPDATE
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);

    const { name, code } = updateCourseDto;

    // Check duplicate name only if name is being updated
    if (name) {
      const existingCourse = await this.courseRepository.findOne({
        where: {
          name: {
            [Op.iLike]: name.trim(),
          },
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingCourse) {
        throw new ConflictException('Course name already exists');
      }
    }

    // Check duplicate code only if code is being updated
    if (code) {
      const existingCourse = await this.courseRepository.findOne({
        where: {
          code: {
            [Op.iLike]: code.trim(),
          },
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingCourse) {
        throw new ConflictException('Course code already exists');
      }
    }

    // Update course
    await course.update({
      ...updateCourseDto,

      ...(name && {
        name: name.trim(),
      }),

      ...(code && {
        code: code.trim(),
      }),
    });

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
