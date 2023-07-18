import {NotFound} from "@tsed/exceptions";
import {Calendar, CreateCalendar} from "../../../model/Calendar";
import {CalendarsService} from "../../../services/calendars/CalendarsService";
import {EventsCtrl} from "../events/EventsCtrl";
import {BodyParams, Controller, Delete, Get, PathParams, Post, Put} from "@tsed/common";
import {Required} from "@tsed/schema";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller({
    path: "/calendars",
    children: [
        EventsCtrl
    ]
})
export class CalendarsCtrl {
    public constructor(private calendarsService: CalendarsService) {
    }

    @Get("/:id")
    public async get(@Required() @PathParams("id") id: string): Promise<Calendar> {
        const calendar = await this.calendarsService.find(id);

        if (calendar) {
            return calendar;
        }

        throw new NotFound("Calendar not found");
    }

    @Put("/")
    public save(@BodyParams() calendar: CreateCalendar): Calendar {
        return this.calendarsService.create(calendar);
    }

    @Post("/:id")
    public update(@PathParams("id") @Required() id: string,
                  @BodyParams() @Required() calendar: CreateCalendar): Calendar {
        return this.calendarsService.update({id, ...calendar});
    }

    @Delete("/")
    public async remove(@BodyParams("id") @Required() id: string): Promise<void> {
        await this.calendarsService.remove(id);
    }

    @Get("/")
    public getAllCalendars(): any {
        return this.calendarsService.query();
    }
}
