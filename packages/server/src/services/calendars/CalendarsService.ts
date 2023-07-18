import {Constant, Service} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Calendar, CreateCalendar} from "../../model/Calendar";
import {MemoryStorage} from "../storage/MemoryStorage";

@Service()
export class CalendarsService {

    @Constant("calendar.token")
    public useToken: boolean;

    public constructor(private memoryStorage: MemoryStorage) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.memoryStorage.set("calendars", require("../../../resources/calendars.json").map((o: any) => {
            return Object.assign(new Calendar, o);
        }));
    }

    /**
     * Find a calendar by his ID.
     * @param id
     * @returns {undefined|Calendar}
     */
    public find(id: string): Calendar | null {
        const calendars: Calendar[] = this.query();

        return calendars.find(calendar => calendar.id === id) ?? null;
    }

    /**
     * Create a new Calendar
     * @returns {{id: any, name: string}}
     * @param newCalendar
     */
    public create(newCalendar: CreateCalendar): Calendar {
        const calendar = new Calendar();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        calendar.id = require("node-uuid").v4();
        calendar.name = newCalendar.name;

        const calendars = this.memoryStorage.get<Calendar[]>("calendars");

        calendars.push(calendar);

        this.memoryStorage.set("calendars", calendars);

        return calendar;
    }

    /**
     *
     * @returns {Calendar[]}
     */
    public query(): Calendar[] {
        return this.memoryStorage.get<Calendar[]>("calendars");
    }

    /**
     *
     * @param updatedCalendar
     * @returns {Calendar}
     */
    public update(updatedCalendar: Partial<Calendar>): Calendar {
        const calendars = this.query();

        const index = calendars.findIndex((value: Calendar) => value.id === updatedCalendar.id);

        calendars[index].name = updatedCalendar.name;

        this.memoryStorage.set("calendars", calendars);

        return calendars[index];
    }

    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    public async remove(id: string): Promise<Calendar> {

        const calendar = await this.find(id);

        if (!calendar) {
            throw new NotFound("Calendar not found");
        }

        const calendars = this.query();

        this.memoryStorage.set("calendars", calendars.filter(calendar => calendar.id === id));

        return calendar;
    }
}
