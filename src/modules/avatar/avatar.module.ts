import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { AvatarSchema } from '../../schemas/avatar.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }])],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule { }
