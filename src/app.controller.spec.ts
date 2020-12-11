import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ClickedLinkEvent,
  ClickedLinkEventSchema,
} from './schemas/ click-link-event.schema';
import {
  SignUpEvent,
  SignUpEventSchema,
} from './schemas/ sign-up-event.schema';
import { Event, EventSchema } from './schemas/event.schema';

describe('AppController', () => {
  const testCase: [string, DynamicModule][] = [
    [
      'forFeature',
      MongooseModule.forFeature([
        {
          name: Event.name,
          schema: EventSchema,
          discriminators: [
            { name: ClickedLinkEvent.name, schema: ClickedLinkEventSchema },
            { name: SignUpEvent.name, schema: SignUpEventSchema },
          ],
        },
      ]),
    ],
    [
      'forFeatureAsync',
      MongooseModule.forFeatureAsync([
        {
          name: Event.name,
          useFactory: async () => EventSchema,
          discriminators: [
            { name: ClickedLinkEvent.name, schema: ClickedLinkEventSchema },
            { name: SignUpEvent.name, schema: SignUpEventSchema },
          ],
        },
      ]),
    ],
  ];

  it.each(testCase)('Discriminator - %s', async (_, features) => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot('mongodb://localhost/nest'), features],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const appController = app.get<AppController>(AppController);
    expect(appController.getHello()).toBe('Hello World!');
    await app.close();
  });
});
