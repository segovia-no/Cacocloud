import {Description, Example, Name, Required} from "@tsed/schema";
import {AbstractModel} from "./AbstractModel";
import {Column, Entity, ManyToMany, OneToMany} from "typeorm";

import { MapModel } from "./Map.model";
import { LumpModel } from "./Lump.model";
import { TagModel } from "./Tags.model";

@Entity()
export class WADModel extends AbstractModel {

    @Column()
    @Description("WAD Name")
    @Example("TNT: Evilution")
    @Name("name")
    @Required()
    public name: string;

    /**
     * This is the filename of the WAD, PK3 or ZIP file
     */
    @Column()
    @Description("Filename")
    @Example("aaliens.zip")
    @Name("filename")
    @Required()
    public filename: string;

    @Column()
    @Description("Size of the file (in bytes)")
    @Example(50000)
    @Name("size")
    public size: number;

    /**
     * The URL of the WAD file should be a relative path to the WAD file on the server
     * and when a user requests it, the server should prefix the server's URL to the URL 
     */
    @Column()
    @Description("URL of the WAD file")
    @Example("/wads/aaliens.zip")
    @Name("url")
    public url: string;

    @Column()
    @Description("Author of the WAD")
    @Example(["John Romero", "Kevin Cloud"])
    @Name("authors")
    public authors: string[];

    @Column()
    @Description("Description of the WAD")
    @Example("A WAD for Doom 2")
    @Name("description")
    public description: string;

    @OneToMany(() => MapModel, map => map.wad)
    public maps: MapModel[];

    @OneToMany(() => LumpModel, lump => lump.wad)
    public lumps: LumpModel[];

    @ManyToMany(() => TagModel, tag => tag.wads)
    public tags: TagModel[];

}
