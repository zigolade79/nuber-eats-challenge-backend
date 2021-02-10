import { Module } from '@nestjs/common';
import { UploadsController } from './uplodads.controller';

@Module({
    controllers:[UploadsController],
})
export class UploadsModule {}
