import {Middleware, PathParams} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {CalendarsService} from "../services/calendars/CalendarsService";
import {Required} from "@tsed/schema";

@Middleware()
export class CheckCalendarIdMiddleware {
    public constructor(private calendarService: CalendarsService) {
    }

    public async use(@Required() @PathParams("calendarId") calendarId: string): Promise<void> {
        const calendar = await this.calendarService.find(calendarId);

        if (!calendar) {
            throw new NotFound("Calendar not found");
        }
    }
}
