import {Exception} from "@tsed/exceptions";


export type ReCAPTCHAResponse = {
    "success": boolean,
    "challenge_ts": string,
    "hostname": string,
    "error-codes": string[]
};


export type HttpErrorRenderObj = {
    status: number,
    title: string | null,
    message: string,
    internalError: Exception
}
