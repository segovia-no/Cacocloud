import {Property, Required} from "@tsed/schema";

export class CreateCalendar {
    @Required()
    public name: string | undefined;
}

export class Calendar extends CreateCalendar {
    @Property()
    public id: string;

    @Property()
    public owner: string;
}
