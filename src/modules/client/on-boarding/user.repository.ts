import { Injectable } from '@nestjs/common';
import { UserDetails } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserDetails> {}
