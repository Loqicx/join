import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent implements ControlValueAccessor {
  dateInputVal: string = '';
  disabled = false;
  showCalendar = false;
  currentMonth: Date = new Date();
  calendarDays: { date: Date; isToday: boolean; isSelected: boolean }[] = [];
  dayNames: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  @Output() dateSelected: EventEmitter<string> = new EventEmitter<string>();

  private onChange = (value: string) => { };
  private onTouched = () => { };

  constructor(private el: ElementRef) {
    this.currentMonth.setDate(1);
    this.generateCalendar();
  }

  /**
   * Handles document click events outside the date picker component.
   * @param {MouseEvent} event - The click event object.
   */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showCalendar = false;
    }
  }

  /**
   * Writes the value to the date picker component.
   * Updates the input value and generates the calendar days.
   * @param {string} value - The new input value.
   */
  writeValue(value: string): void {
    this.dateInputVal = value;
    this.generateCalendar();
  }

  /**
   * Registers a change handler for the date picker component.
   * @param {Function} fn - The function to be called on changes.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a touch handler for the date picker component.
   * @param {Function} fn - The function to be called on touch events.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the date picker component.
   * @param {boolean} isDisabled - Whether the date picker should be disabled or not.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Checks if a given date is valid (not NaN).
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is valid, false otherwise.
   */
  isValidDate(date: Date): boolean {
    return !isNaN(date?.getTime?.());
  }

  /**
   * Checks if a given or clicked date is in the future (later than today).
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is in the future, false otherwise.
   */
  isFutureDate(date: Date): boolean {
    if (!date || isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today;
  }

  /**
   * Handles input events for the date picker component.
   * Updates the input value and generates the calendar days based on user input.
   * @param {Event} event - The input event object.
   */
  onInput(event: Event): void {
  const input = (event.target as HTMLInputElement).value;
  
  const normalized = input.replace(/[-.]/g, '/');
  this.dateInputVal = input;
  this.onChange(this.dateInputVal);

  const parts = normalized.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (!isNaN(parsedDate.getTime())) {
      this.currentMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
    }
    if (this.isValidDate(parsedDate) && this.isFutureDate(parsedDate)) {
      this.onDateSelected(parsedDate);
    }
  }

  this.generateCalendar();
}

  /**
   * Toggles the visibility of the calendar Popp-up.
   */
  toggleCalendar(): void {
    if (!this.disabled) {
      this.showCalendar = !this.showCalendar;
      if (this.showCalendar) this.generateCalendar();
    }
  }

  /**
   * Handles date selection in the calendar Pop-up.
   * Updates the input value, emits an event, and (re)generates the calendar days.
   * @param {Date} date - The selected date.
   */
  onDateSelected(date: Date): void {
    const formattedDate = String(date.getDate()).padStart(2, '0') + '/' +
      String(date.getMonth() + 1).padStart(2, '0') + '/' +
      date.getFullYear();
    const formattedDateForOutput = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
    this.dateInputVal = formattedDate;
    this.onChange(formattedDate);
    this.onTouched();
    this.dateSelected.emit(formattedDateForOutput);
    this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    this.generateCalendar();
    this.showCalendar = false;
  }

  /**
   * Moves Pop up to the previous month.
   */
  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  /**
   * Moves pop up to the next month.
   */
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  /**
   * Private function to generate calendar days for the current month.
   */
  private generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const rawStartDay = startDate.getDay();
    const startDay = (rawStartDay + 6) % 7;
    const totalDays = endDate.getDate();
    this.calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push({ date: new Date(NaN), isToday: false, isSelected: false });
    }
    this.fillCalendarDays(totalDays, year, month);
  }

  /**
   * Private function to fill calendar days with dates for the current month.
   * @param {number} totalDays - The total number of days in the current month.
   * @param {number} year - The current year.
   * @param {number} month - The current month.
   */
  private fillCalendarDays(totalDays: number, year: number, month: number): void {
    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(year, month, i);
      const formattedDate = String(dayDate.getDate()).padStart(2, '0') + '/' +
        String(dayDate.getMonth() + 1).padStart(2, '0') + '/' +
        dayDate.getFullYear();
      const today = new Date();
      const isToday =
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear();
      const isSelected = this.dateInputVal === formattedDate;
      this.calendarDays.push({
        date: dayDate,
        isToday,
        isSelected
      });
    }
  }

  resetCalendar(): void {
    this.dateInputVal = '';
    this.currentMonth = new Date();
    this.generateCalendar();
  }
}
