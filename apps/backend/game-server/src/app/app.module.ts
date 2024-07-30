import { Module } from '@nestjs/common';

import { AuthModule } from '../modules/auth/auth.module';
import { ClawsRoom } from '../modules/claws/claws.room';
import { RoomsModule } from '../modules/rooms/rooms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule.forRoot({
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI:
        'https://st-dev-5c395cd0-4e53-11ef-a24d-7fa502ed3c7e.aws.supertokens.io',
      apiKey: 'DM=imTfRcBAcE6Km3BDZpEH2Mp',
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/passwordless/appinfo
        appName: 'Kingo',
        apiDomain: 'https://api.supertokens.com',
        websiteDomain: 'localhost:3001',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    }),
    // KeycloakConnectModule.register({
    //   authServerUrl: 'https://auth.5ostudios.com',
    //   realm: 'kingo',
    //   clientId: 'account',
    //   secret: 'tR8noNHHdsRkkteYM7PF0UfwnZRWhAnH',
    //   logLevels: ['warn', 'verbose'],
    // }),
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClawsRoom,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
})
export class AppModule {}
