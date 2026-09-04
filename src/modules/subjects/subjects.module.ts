import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from 'src/entity/subject.entity';
import { AuthModule } from '../auth/auth.module';
import { Course } from 'src/entity/course.entity';

@Module({
  imports: [SequelizeModule.forFeature([Subject,Course]), AuthModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
