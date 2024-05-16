import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, SignupDto } from './dto/on-boarding.dto';
import { UserRepository } from './user.repository';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class ClientOnBoardingService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signupDto: SignupDto,
  ): Promise<{ token: string; user: UserDetails }> {
    try {
      const { username, email } = signupDto;
      console.log('email--------', email);

      // Check if a user with the provided email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Save the user using the EntityManager or Repository
      const user = this.userRepository.create({
        username: username,
        email,
        password: await bcrypt.hash(signupDto.password),
      });

      const token = this.jwtService.sign({ id: user.id });

      return { token, user };
    } catch (err) {
      throw err;
    }
  }

  async create(createUserDto: SignupDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(payload: any) {
    try {
      await this.userRepository.findOne({ where: { email: payload.email } });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      console.log('----------------');
      const { email, password } = loginDto;

      // Find the user by email
      const user = await this.userRepository.findOne({
        where: { email },
      } as FindOneOptions<UserDetails>);
      console.log(user, '0000000000000000');

      // If no user is found, throw NotFoundException
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Compare the provided password with the hashed password
      const isPasswordMatched = await bcrypt.compare(password, user.password);

      // If the passwords don't match, throw BadRequestException
      if (!isPasswordMatched) {
        throw new BadRequestException('Invalid email or password');
      }

      // Generate and return a JWT token
      const token = this.jwtService.sign({ id: user.id });
      return { token };
    } catch (err) {
      // Rethrow the error if it's not a specific exception
      throw err;
    }
  }
  async verifyUser(email: string, password: string) {
    console.log('=++++++++++++++++++++++++++');
    const user = await this.userRepository.findOne({
      where: { email },
    } as FindOneOptions<UserDetails>);
    console.log(user, '+===============');

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  async getUser(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    return user;
  }
}
