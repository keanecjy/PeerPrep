import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { User } from './../users/user.entity';
import { AuthUser } from './../shared/decorators/user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UseAuth } from 'src/shared/decorators/auth.decorator';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  @UseAuth(JwtAuthGuard)
  create(
    @AuthUser() requester: User,
    @Body() createInterviewDto: CreateInterviewDto
  ) {
    const participants = [{ id: requester.id }];
    if (createInterviewDto.partner) {
      participants.push({ id: createInterviewDto.partner });
    }
    return this.interviewService.create(createInterviewDto, participants);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const interview = await this.interviewService.findOne(id);

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }
}
