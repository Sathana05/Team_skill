import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './certification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CertificationsService {
  constructor(
    @InjectRepository(Certification) private certsRepo: Repository<Certification>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async addCertification(userId: string, body: any) {
    const { name, issuer, year } = body;
    if (!name) throw new BadRequestException('Certification name required');
    const cert = this.certsRepo.create({ name, issuer, year, userId });
    await this.certsRepo.save(cert);
    return this.getUser(userId);
  }

  async deleteCertification(userId: string, certId: string) {
    await this.certsRepo.delete({ id: certId, userId });
    return this.getUser(userId);
  }

  private async getUser(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const { password, ...rest } = user;
    return rest;
  }
}
