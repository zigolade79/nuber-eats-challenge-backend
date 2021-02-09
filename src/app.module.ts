import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { PodcastModule } from './podcasts/podcast.module';
import { UserModule } from './users/user.module';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './podcasts/entities/podcast.entity';
import { Episode } from './podcasts/entities/episode.entity';
import { User } from './users/entities/user.entity';
import { Review } from './podcasts/entities/review.entity';
import { JwtMiddleware } from './jwt/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === "prod",      
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
        
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port:+process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PW, 
      database:process.env.DB_NAME,      
      synchronize: process.env.NODE_ENV !=="prod",
      logging:  process.env.NODE_ENV !=="prod" && process.env.NODE_ENV !== "test",
      entities: [Podcast, Episode, User, Review],     
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => {
        return { user: req["user"] };
      },
      playground: true,
      introspection: true,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    PodcastModule,
    UserModule,
    JwtModule
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: "/graphql",
      method: RequestMethod.POST,
    });
  }
}
