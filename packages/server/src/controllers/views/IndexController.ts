import {Get, Hidden, View} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/")
@Hidden()
export class IndexController {

    @Get()
    @View("index.html")
    public showRoot(): boolean {
        return true;
    }

}
