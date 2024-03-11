import { Logger, Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  providers: [AppGateway, AppService, Logger],
})
export class AppModule {}
