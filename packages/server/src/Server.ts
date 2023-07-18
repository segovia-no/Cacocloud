import {AfterRoutesInit, Configuration, Constant, PlatformApplication} from "@tsed/common";
import {Inject} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/swagger";
import * as bodyParser from "body-parser";
import compression from "compression";
import * as path from "path";
import process from "process";
import helmet from "helmet";
import cors from "cors";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import * as rest from "./controllers/index";
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

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/dist");

@Configuration({
    rootDir,
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8081,
    httpsPort: false,
    mount: {
        "/rest": [
            ...Object.values(rest)
        ]
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
    swagger: [
        {
            path: "/api-docs"
        }
    ],
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
    }
})
export class Server implements AfterRoutesInit {

    @Inject()
    private app: PlatformApplication;

    @Constant("envs.SESSION_KEY")
    private readonly sessionKey: string;

    @Constant("envs.HTTPS")
    private readonly https: string;

    @Inject(SQLITE_DATA_SOURCE)
    private ds: DataSource;

    public $afterRoutesInit(): void | Promise<any> {
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
        this.app.get("/", (req: any, res: any) => {
            if (!res.headersSent) {
                // prevent index.html caching
                res.set({
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache"
                });
            }
        });
        this.app.get(`*`, (req: any, res: any) => {
            res.sendFile(path.join(clientDir, "index.html"));
        });
    }
}
