import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, MoreThanOrEqual } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async getProfile(userId: string) {
    const user = await this.repo.findOne({ where: { id: userId } });
    const { password, ...rest } = user;
    return rest;
  }

  async updateProfile(userId: string, body: any) {
    const { name, department, jobTitle, yearsOfExperience } = body;
    await this.repo.update(userId, { name, department, jobTitle, yearsOfExperience });
    return this.getProfile(userId);
  }

  async searchEmployees(query: any) {
    const { skill, department, minExp, certification } = query;
    const qb = this.repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skill')
      .leftJoinAndSelect('user.certifications', 'cert')
      .where('user.role = :role', { role: 'employee' });

    if (skill) qb.andWhere('skill.name ILIKE :skill', { skill: `%${skill}%` });
    if (department) qb.andWhere('user.department ILIKE :dept', { dept: `%${department}%` });
    if (minExp) qb.andWhere('user.yearsOfExperience >= :minExp', { minExp: Number(minExp) });
    if (certification) qb.andWhere('cert.name ILIKE :cert', { cert: `%${certification}%` });

    const users = await qb.getMany();
    return users.map(({ password, ...rest }) => rest);
  }
}
