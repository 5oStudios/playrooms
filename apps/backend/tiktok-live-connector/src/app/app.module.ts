import { Logger, Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [ChatModule],
  providers: [AppGateway, AppService, Logger],
})
export class AppModule {}
