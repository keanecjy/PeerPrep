import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    // if (id !== requester.id) {
    //   throw new UnauthorizedException('Not allowed to update profile');
    // }
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // if (id !== requester.id) {
    //   throw new UnauthorizedException('Not allowed to delete profile');
    // }
    return this.profileService.remove(id);
  }
}
