import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entity/user.model';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) { }

  async register(registerDto: RegisterDto) {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      password,
      confirmPassword,
    } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingEmail = await this.userModel.findOne({
      where: {
        email,
      }
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingPhone = await this.userModel.findOne({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      password,
    });

    return user;

  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.password !== password) {
      throw new UnauthorizedException()
    }

    return user;
  }

}
