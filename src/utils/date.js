import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import differenceInCalendarWeeks from 'date-fns/difference_in_calendar_weeks'
import differenceInCalendarMonths from 'date-fns/difference_in_calendar_months'
import differenceInCalendarQuarters from 'date-fns/difference_in_calendar_quarters'
import differenceInCalendarYears from 'date-fns/difference_in_calendar_years'

export const UNITS = {
  DAYS: 0,
  WEEKS: 1,
  MONTHS: 2,
  QUARTERS: 3,
  YEARS: 4,
}
const DAY = 1000 * 60 * 60 * 24,
  WEEK = DAY * 7,
  MONTH = DAY * 30,
  QUARTER = MONTH * 3,
  YEAR = WEEK * 52;

export const getUnitsBetween = function (date1, date2, units) {
  var num_units;
  switch(units) {
    case UNITS.DAYS:
      return differenceInCalendarDays(date2, date1)
    case UNITS.WEEKS:
      return differenceInCalendarWeeks(date2, date1)
    case UNITS.MONTHS:
      return differenceInCalendarMonths(date2, date1)
    case UNITS.QUARTERS:
      return differenceInCalendarQuarters(date2, date1)
    case UNITS.YEARS:
      return differenceInCalendarYears(date2, date1)
    default:
      throw new Error("Unexpected date unit type")
  }
  // return Math.round(num_units)
}


export const sort = function (date1, date2) {
  let d1 = new Date(date1),
    d2 = new Date(date2);

    if (d1 < d2) {
      return -1
    } 
    if (d1 > d2) {
      return 1
    }
    return 0
}


// Create a list of day and monthnames.
export const
  weekdays = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
  ],
  MONTHS = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
export const SHORT_MONTHS = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec",
  ];

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
export function nth (d) {
  if(d>3 && d<21) return 'th';
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

// Create a string representation of the date.
export function formatDate ( date ) {
    return weekdays[date.getDay()] + ", " +
        date.getDate() + nth(date.getDate()) + " " +
        months[date.getMonth()] + " " +
        date.getFullYear();
}


export function getWeekNumber(date) {
  var d = new Date(date);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
}