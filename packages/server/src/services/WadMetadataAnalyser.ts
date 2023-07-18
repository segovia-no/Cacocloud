import {Constant, Inject, Service} from "@tsed/di";
import GlobalEnv from "../model/constants/GlobalEnv";
import {WADMetadata} from "../utils/typeings";
import fetch from 'node-fetch';
import fs from "fs";
import {Logger} from "@tsed/logger";
import {BadRequest} from "@tsed/exceptions";

@Service()
export class WadMetadataAnalyser {

    @Inject()
    private logger: Logger;

    @Constant(GlobalEnv.WAD_ANALYSER_URI)
    private readonly botUri: string;

    public getWadMetadata(wad: Buffer): Promise<WADMetadata>
    public getWadMetadata(wad: string): Promise<WADMetadata>
    public async getWadMetadata(wad: string | Buffer): Promise<WADMetadata> {
        let buff: Buffer;
        if (typeof wad == "string") {
            buff = await fs.promises.readFile(wad);
        } else {
            buff = wad;
        }
        const resp = await fetch(this.botUri, {
            body: buff
        });
        if (!resp.ok) {
            this.logger.warn(`Unable to query analyser.`, resp.statusText);
            throw new BadRequest("An error has occurred");
        }
        return resp.json();
    }
}
