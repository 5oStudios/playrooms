import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from '../modules/rooms/rooms.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ClawsRoom } from '../modules/claws/claws.room';

@Module({
  imports: [RoomsModule,
    KeycloakConnectModule.register({
      authServerUrl: 'https://auth.5ostudios.com',
      realm: 'kingo',
      clientId: 'account',
      secret: 'tR8noNHHdsRkkteYM7PF0UfwnZRWhAnH',
      logLevels: ['warn', 'verbose'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    ClawsRoom,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],

})


export class AppModule {
}
