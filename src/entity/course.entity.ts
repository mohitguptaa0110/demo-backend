import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Subject } from './subject.entity';

@Table({ tableName: 'courses', paranoid: true })
export class Course extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @HasMany(() => Subject)
  declare subjects?: Subject[];
}
