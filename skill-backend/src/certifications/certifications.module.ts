import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationsService } from './certifications.service';
import { CertificationsController } from './certifications.controller';
import { Certification } from './certification.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certification, User])],
  providers: [CertificationsService],
  controllers: [CertificationsController],
})
export class CertificationsModule {}
