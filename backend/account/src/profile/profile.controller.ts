import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/user.entity';
import { AuthUser } from '../shared/decorators/user.decorator';
import { UseAuth } from '../shared/decorators/auth.decorator';
import { Profile } from './profile.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Interview } from 'src/interview/interview.entity';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get profile of authenticated user
   */
  @ApiOkResponse({ type: Profile })
  @UseAuth(JwtAuthGuard)
  @Get('me')
  findMe(@AuthUser() requester: User): Promise<Profile> {
    return this.profileService.findOne(requester.id);
  }

  /**
   * Get a user profile
   */
  @ApiOkResponse({ type: Profile })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile> {
    return this.profileService.findOne(id);
  }

  /**
   * Get a user profile
   */
  @ApiOkResponse({ type: Profile })
  @Get('/interview/:id')
  findOneWithInterview(@Param('id') id: string): Promise<Interview[]> {
    return this.profileService
      .findOneWithInterviews(id)
      .then((profile) => profile.interviews);
  }

  /**
   * Update a user profile
   */
  @UseAuth(JwtAuthGuard)
  @Put(':id')
  async update(
    @AuthUser() requester: User,
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<string> {
    if (id !== requester.id) {
      throw new ForbiddenException('Not allowed to update profile');
    }
    await this.profileService.update(id, updateProfileDto);
    return 'Successfully updated profile';
  }

  /**
   * Delete a user profile
   */
  @UseAuth(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @AuthUser() requester: User,
    @Param('id') id: string
  ): Promise<string> {
    if (id !== requester.id) {
      throw new ForbiddenException('Not allowed to delete profile');
    }
    await this.profileService.remove(id);
    return 'Successfully deleted profile';
  }
}
