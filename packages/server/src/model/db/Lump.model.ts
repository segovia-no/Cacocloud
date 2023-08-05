import {Description, Example, Name, Required} from "@tsed/schema";
import {AbstractModel} from "./AbstractModel";
import {Column, Entity, ManyToOne} from "typeorm";

import { WADModel } from "./Wad.model";

@Entity()
export class LumpModel extends AbstractModel {

    @Column()
    @Description("The lump's name inside the WAD")
    @Example("HEADC5")
    @Name("name")
    @Required()
    public name: string;

    @Column()
    @Description("Size of the lump (in bytes)")
    @Example(3835)
    @Required()
    @Name("size")
    public size: number;

    @Column()
    @Description("Type of lump")
    @Example("Graphic (flat)")
    @Name("type")
    public type: string;

    /**
     * The URL of the Lump file should be a relative path to the lump file on the server
     * and when a user requests it, the server should prefix the server's URL to the URL 
     */
    @Column()
    @Description("URL of the lump file")
    @Example("/lumps/aaliens/HEADC5")
    @Name("url")
    public url: string;

    @ManyToOne(() => WADModel, wad => wad.lumps)
    public wad: WADModel;

}
