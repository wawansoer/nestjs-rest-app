import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { UsersModule } from './modules/users/users.module';
/**
 * The AppModule is the main module of the NestJS application.
 * It imports and configures various modules, controllers, and services.
 *
 * Inputs:
 * - ConfigModule from '@nestjs/config'
 * - MongooseModule from '@nestjs/mongoose'
 * - AppController from './app.controller'
 * - AppService from './app.service'
 * - UserModule from './modules/user/user.module'
 * - UsersModule from './modules/users/users.module'
 *
 * Flow:
 * 1. Import and configure ConfigModule to load environment variables.
 * 2. Import and configure MongooseModule to connect to a MongoDB database.
 * 3. Import UserModule and UsersModule, which contain their own controllers and services.
 * 4. Define the main AppModule, which includes importing all the necessary modules, controllers, and services.
 *
 * Outputs:
 * - AppModule, which is the main module of the NestJS application.
 *
 * Additional aspects:
 * - The AppModule imports and configures various modules, including ConfigModule and MongooseModule, which are used to load environment variables and connect to a MongoDB database, respectively.
 * - The AppModule also imports UserModule and UsersModule, which contain their own controllers and services.
 * - The AppModule defines the main controllers and services of the NestJS application, including AppController and AppService.
 */

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UserModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
