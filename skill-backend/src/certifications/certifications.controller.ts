import { Controller, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CertificationsService } from './certifications.service';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('profile/certifications')
@UseGuards(AuthGuard('jwt'))
export class CertificationsController {
  constructor(private certsService: CertificationsService) {}

  @Post()
  addCertification(@CurrentUser() user: any, @Body() body: any) {
    return this.certsService.addCertification(user.id, body);
  }

  @Delete(':certId')
  deleteCertification(@CurrentUser() user: any, @Param('certId') certId: string) {
    return this.certsService.deleteCertification(user.id, certId);
  }
}
