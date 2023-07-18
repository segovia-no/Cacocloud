import {BeforeRoutesInit, Configuration, Constant, PlatformApplication} from "@tsed/common";
import {Inject} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/swagger";
import "@tsed/ajv";
import * as bodyParser from "body-parser";
import compression from "compression";
import * as path from "path";
import process from "process";
import helmet from "helmet";
import cors from "cors";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import * as rest from "./controllers/rest/index";
import {config} from "./config";
import {BadRequest} from "@tsed/exceptions";
import {FileFilterCallback} from "multer";
import {CustomUserInfoModel} from "./model/auth/CustomUserInfoModel";
import {TypeormStore} from "connect-typeorm";
import session from "express-session";
import {SessionModel} from "./model/db/Session.model";
import {DataSource} from "typeorm";
import {SQLITE_DATA_SOURCE} from "./model/di/tokens";
import {isProduction} from "./config/envs";
import GlobalEnv from "./model/constants/GlobalEnv";
import * as views from "./controllers/views";

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/dist");

const opts: Partial<TsED.Configuration> = {
    rootDir,
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT ?? 8083,
    httpsPort: (function (): number | boolean {
        if (process.env.HTTPS === "true") {
            return Number.parseInt(process.env.HTTPS_PORT as string);
        }
        return false;
    }()),
    mount: {
        "/rest": [
            ...Object.values(rest)
        ],
        "/": [
            ...Object.values(views)
        ],
    },
    componentsScan: [`./services/**/**.js`],
    multer: {
        dest: `${__dirname}/../customWads`,
        fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
            const allowedFiles = process.env.ALLOWED_FILES;
            if (!allowedFiles) {
                return cb(null, true);
            }
            const fileExt = file.originalname.split(".").pop() ?? "";
            const allowedFilesArr = allowedFiles.split(",");
            if (!allowedFilesArr.includes(fileExt.toLowerCase())) {
                return cb(new BadRequest(`Invalid file: got ${fileExt}, expected: ${allowedFilesArr.join(", ")}`));
            }
            return cb(null, true);
        },
        limits: {
            fileSize: Number.parseInt(process.env.FILE_SIZE_UPLOAD_LIMIT_MB as string) * 1048576
        },
        preservePath: true
    },
    passport: {
        userInfoModel: CustomUserInfoModel
    },
    middlewares: [
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: {
                policy: "credentialless"
            }
        }),
        cors({
            origin: process.env.BASE_URL,
            exposedHeaders: ["Location"]
        }),
        cookieParser(),
        methodOverride(),
        bodyParser.json(),
        bodyParser.urlencoded({
            extended: true
        }),
        compression()
    ],
    calendar: {
        token: true
    },
    statics: {
        "/": [
            {
                root: clientDir
            }
        ]
    },
    exclude: [
        "**/*.spec.ts"
    ]
};

if (!isProduction) {
    opts["swagger"] = [
        {
            path: "/api-docs",
            specVersion: "3.0.3",
            options: {
                withCredentials: true
            }
        }
    ];
}

@Configuration(opts)
export class Server implements BeforeRoutesInit {

    @Inject()
    private app: PlatformApplication;

    @Constant(GlobalEnv.SESSION_KEY)
    private readonly sessionKey: string;

    @Constant(GlobalEnv.HTTPS)
    private readonly https: string;

    @Inject(SQLITE_DATA_SOURCE)
    private ds: DataSource;

    public $beforeRoutesInit(): void | Promise<any> {
        this.app.use(session({
            secret: this.sessionKey,
            resave: false,
            store: new TypeormStore({
                cleanupLimit: 2,
            }).connect(this.ds.getRepository(SessionModel)),
            saveUninitialized: false,
            cookie: {
                path: "/",
                httpOnly: true,
                maxAge: 86400000,
                secure: this.https === "true",
                sameSite: "strict"
            }
        }));
        if (isProduction) {
            this.app.getApp().set("trust proxy", 1);
        }
    }
}
