import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Course } from './course.entity';

@Table({
  tableName: 'subjects',
  paranoid: true,
})
export class Subject extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @ForeignKey(() => Course)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare courseId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare year: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare subjectName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare credits: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @BelongsTo(() => Course)
  declare course?: Course;
}
