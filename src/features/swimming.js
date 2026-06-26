const swimmingStartMonthIndex = 0;
const swimmingStartDayOfMonth = 5;
const swimmingStartHours = [2];
const swimmingStartDayCounter = 0;
const swimmingReferenceStartYear = 2026;
const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isSameCalendarDay(left, right) {
    return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate();
}

function getSwimmingAnchorDate(date) {
    const anchor = new Date(
        date.getFullYear(),
        swimmingStartMonthIndex,
        swimmingStartDayOfMonth,
        0,
        0,
        0,
        0,
    );

    if (date < anchor) {
        anchor.setFullYear(anchor.getFullYear() - 1);
    }

    return anchor;
}

function appendSwimmingPair(hours, hour) {
    hours.push(hour);

    if (hour >= 1 && hour <= 3) {
        hours.push(hour + 9);
    }
}

function getSwimmingReferenceYear(monthIndex, dayOfMonth) {
    if (monthIndex < swimmingStartMonthIndex) {
        return swimmingReferenceStartYear + 1;
    }

    if (monthIndex === swimmingStartMonthIndex && dayOfMonth < swimmingStartDayOfMonth) {
        return swimmingReferenceStartYear + 1;
    }

    return swimmingReferenceStartYear;
}

function parseGameClockDate(dateText, timeText) {
    const dateMatch = dateText.trim().match(/^([A-Za-z]{3})\s+(\d{1,2})(?:st|nd|rd|th)$/);
    const timeMatch = timeText.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]m)$/i);

    if (!dateMatch || !timeMatch) {
        return null;
    }

    const monthIndex = monthShortNames.indexOf(dateMatch[1]);

    if (monthIndex === -1) {
        return null;
    }

    const dayOfMonth = Number.parseInt(dateMatch[2], 10);
    const hour12 = Number.parseInt(timeMatch[1], 10);
    const minutes = Number.parseInt(timeMatch[2], 10);
    const seconds = Number.parseInt(timeMatch[3] || "0", 10);
    const meridiem = timeMatch[4].toLowerCase();
    const normalizedHour = hour12 % 12;
    const hour24 = meridiem === "pm" ? normalizedHour + 12 : normalizedHour;
    const year = getSwimmingReferenceYear(monthIndex, dayOfMonth);

    return new Date(year, monthIndex, dayOfMonth, hour24, minutes, seconds, 0);
}

function getSwimmingHoursForDate(date) {
    let currentDate = getSwimmingAnchorDate(date);
    let currentHours = [...swimmingStartHours];
    let dayCounter = swimmingStartDayCounter;

    while (!isSameCalendarDay(currentDate, date)) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);

        let nextDayCounter = dayCounter + 1;
        let applyWeeklyPenalty = false;

        if (nextDayCounter === 7) {
            nextDayCounter = 0;
            applyWeeklyPenalty = true;
        }

        const monthChanged = nextDate.getMonth() !== currentDate.getMonth();
        const nextHours = [];

        currentHours.forEach((hour) => {
            let nextHour = hour - 1;

            if (applyWeeklyPenalty) {
                nextHour -= 1;
            }

            if (monthChanged) {
                nextHour += 3;
            }

            if (nextHour <= 0) {
                return;
            }

            nextHour = ((nextHour - 1) % 12) + 1;
            appendSwimmingPair(nextHours, nextHour);
        });

        currentHours = [...new Set(nextHours)].sort((left, right) => left - right);
        currentDate = nextDate;
        dayCounter = nextDayCounter;
    }

    return currentHours;
}

function getSwimmingWindowStartsForDate(date) {
    const hours = getSwimmingHoursForDate(date);

    return hours.flatMap((hour) => {
        const amHour = hour % 12;
        const pmHour = amHour + 12;

        return [
            new Date(date.getFullYear(), date.getMonth(), date.getDate(), amHour, 0, 0, 0),
            new Date(date.getFullYear(), date.getMonth(), date.getDate(), pmHour, 0, 0, 0),
        ];
    });
}

function isSwimmingHourAt(date) {
    return getSwimmingWindowStartsForDate(date).some((start) => {
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return date >= start && date < end;
    });
}

function getNextSwimmingWindowStart(date, maxDaysToCheck = 370) {
    const startOfSearchDay = new Date(date);
    startOfSearchDay.setHours(0, 0, 0, 0);

    for (let offset = 0; offset <= maxDaysToCheck; offset += 1) {
        const searchDay = new Date(startOfSearchDay);
        searchDay.setDate(searchDay.getDate() + offset);

        const nextStart = getSwimmingWindowStartsForDate(searchDay)
            .sort((left, right) => left - right)
            .find((start) => start > date);

        if (nextStart) {
            return nextStart;
        }
    }

    return null;
}

function formatSwimmingHour(date) {
    const hour = date.getHours();
    const displayHour = hour % 12 || 12;
    const meridiem = hour < 12 ? "am" : "pm";
    return `${displayHour} ${meridiem}`;
}

function formatNextSwimmingReminder(now, nextStart) {
    if (!nextStart) {
        return "Swim: n/a";
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isSameCalendarDay(now, nextStart)) {
        return `Swim: ${formatSwimmingHour(nextStart)}`;
    }

    if (isSameCalendarDay(tomorrow, nextStart)) {
        return `Swim: Tomorrow ${formatSwimmingHour(nextStart)}`;
    }

    return `Swim: ${monthShortNames[nextStart.getMonth()]} ${nextStart.getDate()} ${formatSwimmingHour(nextStart)}`;
}
