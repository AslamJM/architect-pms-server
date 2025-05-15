import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import configuration from 'src/config/configuration';


@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {

    constructor() {
        super({
            datasources: {
                db: {
                    url: configuration().database.url,
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect()
    }
}
