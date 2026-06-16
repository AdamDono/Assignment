import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }

  createUser(email: string, hashedPassword: string, role: UserRole = 'customer'): Promise<User> {
    const user = this.usersRepo.create({ email, password: hashedPassword, role });
    return this.usersRepo.save(user);
  }
}
