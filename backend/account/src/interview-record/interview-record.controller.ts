import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../users/user.entity';
import { AuthUser } from '../shared/decorators/user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { InterviewRecordService } from './interview-record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UseAuth } from 'src/shared/decorators/auth.decorator';

@ApiTags('Interview Record')
@Controller('records')
export class InterviewRecordController {
  constructor(private readonly interviewService: InterviewRecordService) {}

  @Post()
  @UseAuth(JwtAuthGuard)
  create(
    @AuthUser() requester: User,
    @Body() createInterviewDto: CreateRecordDto
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
