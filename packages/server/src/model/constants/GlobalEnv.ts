const prefix = "envs.";

/**
 * Env to be used in `@Constant` decorators
 */
enum GlobalEnv {
    PORT = `${prefix}PORT`,
    SESSION_KEY = `${prefix}SESSION_KEY`,
    HTTPS = `${prefix}HTTPS`,
    HTTPS_PORT = `${prefix}HTTPS_PORT`,
    ALLOWED_FILES = `${prefix}ALLOWED_FILES`,
    ALLOWED_HEADERS = `${prefix}ALLOWED_HEADERS`,
    NODE_ENV = `${prefix}NODE_ENV`,
    BASE_URL = `${prefix}BASE_URL`,
    RECAPTCHA_SITE_KEY = `${prefix}RECAPTCHA_SITE_KEY`,
    RECAPTCHA_SECRET_KEY = `${prefix}RECAPTCHA_SECRET_KEY`,
    FILE_SIZE_UPLOAD_LIMIT_MB = `${prefix}FILE_SIZE_UPLOAD_LIMIT_MB`,
}

export default GlobalEnv;
