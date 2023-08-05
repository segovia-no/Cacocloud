import {Description, Example, Name, Required} from "@tsed/schema";
import {AbstractModel} from "./AbstractModel";
import {Column, Entity, ManyToOne} from "typeorm";
import {WADModel} from "./Wad.model";

@Entity()
export class MapModel extends AbstractModel {

    @Column()
    @Description("Map Name")
    @Example("MAP03")
    @Name("name")
    @Required()
    public name: string;

    @Column()
    @Description("The non technical name of the map")
    @Example("Shores of hell")
    @Name("nicename")
    public niceName: string;

    @Column()
    @Description("Author of the WAD")
    @Example(["John Romero", "American McGee"])
    @Name("authors")
    public authors: string[];

    @ManyToOne(() => WADModel, wad => wad.maps)
    @Description("The WAD this map belongs to")
    public wad: WADModel;

}
