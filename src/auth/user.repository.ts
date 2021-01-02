import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async SignUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSaltSync(10);
    console.log(salt);

    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
      // console.log(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User name or email exists');
      } else {
        throw new InternalServerErrorException();
      }
    //   console.log(error.code);
    }
  }

  async validatePassword(
    authCredentialDto: AuthCredentialDto,
  ): Promise<string> {
    const { username, password } = authCredentialDto;

    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
