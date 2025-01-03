import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
        .setTitle('Konrad_app(truck_service)')
        .setDescription('Docs REST API')
        .setVersion('1.0.0')
        .addTag('ALEX K')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document)
    app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Serv + port ${PORT}`));
}
bootstrap();
