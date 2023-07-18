import {$log, Logger as TsEdLogger, registerProvider} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";
import {DataSource} from "typeorm";
import {SQLITE_DATA_SOURCE} from "./model/di/tokens";

async function bootstrap(): Promise<void> {

    const dataSource = new DataSource({
        type: "better-sqlite3",
        entities: [`${__dirname}/model/db/**/*.model.{ts,js}`],
        synchronize: true,
        database: "main.sqlite"
    });

    registerProvider<DataSource>({
        provide: SQLITE_DATA_SOURCE,
        type: "typeorm:datasource",
        deps: [TsEdLogger],
        async useAsyncFactory(logger: TsEdLogger) {
            await dataSource.initialize();
            dataSource.setOptions({});
            logger.info(`Connected with typeorm to database: ${dataSource.options.database}`);
            return dataSource;
        },
        hooks: {
            $onDestroy(dataSource) {
                return dataSource.isInitialized && dataSource.destroy();
            }
        }
    });

    try {
        $log.debug("Start server...");
        const platform = await PlatformExpress.bootstrap(Server, {});

        await platform.listen();
        $log.debug("Server initialized");
    } catch (er) {
        $log.error(er);
    }
}

bootstrap();
