import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from 'src/entity/course.entity';
import { Subject } from 'src/entity/subject.entity';
import {
  CreateCurriculumDto,
  SubjectQueryDto,
  UpdateSubjectDto,
} from './dto/subjects.dto';
import { Op } from 'sequelize';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject)
    private readonly subjectRepository: typeof Subject,

    @InjectModel(Course)
    private readonly courseRepository: typeof Course,
  ) {}

  // =====================================================
  // GET ALL SUBJECTS
  // =====================================================
  async findAll(query: SubjectQueryDto) {
    const { offset, limit, search, sortColumn, sortDirection } = query;

    const allowedColumns = ['subjectName', 'code', 'year', 'credits'];

    const column = allowedColumns.includes(sortColumn ?? '')
      ? sortColumn!
      : 'subjectName';

    const direction = sortDirection === 'DESC' ? 'DESC' : 'ASC';

    const where: any = {};

    if (search?.trim()) {
      where[Op.or] = [
        {
          subjectName: {
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

    const { rows, count } = await this.subjectRepository.findAndCountAll({
      where,

      include: [
        {
          model: Course,
          attributes: ['id', 'name', 'code','duration'],
        },
      ],

      offset,

      limit,

      order: [[column, direction]],
    });

    return {
      data: rows,
      total: count,
    };
  }

  // =====================================================
  // GET SUBJECTS BY COURSE
  // =====================================================

  async findByCourse(courseId: number) {
    const course = await this.courseRepository.findOne({
      where: {
        id: courseId,
        deletedAt: null,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return this.subjectRepository.findAll({
      where: {
        courseId,
        deletedAt: null,
      },

      order: [
        ['year', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  }

  // =====================================================
  // CREATE COMPLETE CURRICULUM
  // =====================================================

  async createCurriculum(dto: CreateCurriculumDto) {
    const course = await this.courseRepository.findOne({
      where: {
        id: dto.courseId,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const courseDuration = course.duration;

    // ===================================================
    // VALIDATE YEARS
    // ===================================================

    for (const yearGroup of dto.years) {
      if (yearGroup.year > courseDuration) {
        throw new BadRequestException(
          `Year ${yearGroup.year} is not valid for this course.`,
        );
      }
    }

    // ===================================================
    // FLATTEN SUBJECTS
    // ===================================================

    const subjects = dto.years.flatMap((yearGroup) =>
      yearGroup.subjects.map((subject) => ({
        courseId: dto.courseId,
        year: yearGroup.year,
        subjectName: subject.subjectName,
        code: subject.code,
        credits: subject.credits,
        description: subject.description ?? null,
      })),
    );

    // ===================================================
    // CHECK DUPLICATE CODES
    // ===================================================

    const codes = subjects.map((subject) => subject.code.toLowerCase());

    const uniqueCodes = new Set(codes);

    if (uniqueCodes.size !== codes.length) {
      throw new BadRequestException('Duplicate subject code found.');
    }

    // ===================================================
    // SAVE ALL SUBJECTS
    // ===================================================

    return this.subjectRepository.bulkCreate(subjects);
  }

  // =====================================================
  // UPDATE SUBJECT
  // =====================================================

  async update(id: number, dto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }

    const updateData: any = {};

    if (dto.subjectName !== undefined) {
      updateData.subjectName = dto.subjectName.trim();
    }

    if (dto.code !== undefined) {
      updateData.code = dto.code.trim();
    }

    if (dto.credits !== undefined) {
      updateData.credits = dto.credits;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description.trim() || null;
    }

    await subject.update(updateData);

    // Get the updated subject again with Course
    return this.subjectRepository.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Course,
          attributes: ['id', 'name', 'code','duration'],
        },
      ],
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async remove(id: number) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }
    await subject.destroy();

    return {
      message: 'Subject deleted successfully.',
    };
  }
}
