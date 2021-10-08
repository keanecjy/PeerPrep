import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { StatusResponseDto } from 'src/shared/status-response.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get a user profile
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  /**
   * Update a user profile
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    // if (id !== requester.id) {
    //   throw new UnauthorizedException('Not allowed to update profile');
    // }
    return this.profileService.update(id, updateProfileDto);
  }

  /**
   * Delete a user profile
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<StatusResponseDto> {
    // if (id !== requester.id) {
    //   throw new UnauthorizedException('Not allowed to delete profile');
    // }
    await this.profileService.remove(id);
    return {
      success: true,
      message: 'Successfully deleted profile',
    };
  }
}
