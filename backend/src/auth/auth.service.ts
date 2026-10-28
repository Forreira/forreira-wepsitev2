import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { AdminUser } from './entities/admin-user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser) private readonly admins: Repository<AdminUser>,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.admins.findOneBy({ email });
    const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    // Same error for unknown email and wrong password to avoid user enumeration.
    if (!user || !isValid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { accessToken };
  }
}
