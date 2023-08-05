import {Description, Example, Name, Required} from "@tsed/schema";
import {AbstractModel} from "./AbstractModel";
import {Column, Entity, ManyToMany} from "typeorm";

import { WADModel } from "./Wad.model";

@Entity()
export class TagModel extends AbstractModel {

    @Column()
    @Description("Tag name")
    @Example("Terrywad")
    @Name("tag")
    @Required()
    public tag: string;

    @Column()
    @Description("The color of the tag when displayed on the website")
    @Example("#FF0000")
    @Name("color")
    public color: string;

    @ManyToMany(() => WADModel, wad => wad.tags)
    public wads: WADModel[];

}
