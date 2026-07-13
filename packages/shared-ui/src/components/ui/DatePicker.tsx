import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface DatePickerProps {
  value?: Date | string
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  // Handle both string dates and Date objects
  const dateValue = typeof value === 'string' && value 
    ? new Date(value) 
    : value as Date | undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-12 justify-start text-left font-normal rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950 px-4 text-sm ring-offset-background hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all",
            !dateValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 text-teal-500" />
          {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={onChange}
          initialFocus
          className="p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-bold text-slate-900 dark:text-white",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-slate-500 dark:text-slate-400 rounded-md w-9 font-normal text-[0.8rem] mb-2",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-teal-50 dark:[&:has([aria-selected])]:bg-teal-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 rounded-xl overflow-hidden",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors",
            day_selected: "bg-teal-500 text-white hover:bg-teal-600 hover:text-white focus:bg-teal-500 focus:text-white !rounded-xl shadow-md shadow-teal-500/20 font-bold",
            day_today: "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold",
            day_outside: "text-slate-400 dark:text-slate-600 opacity-50",
            day_disabled: "text-slate-400 dark:text-slate-600 opacity-50",
            day_range_middle: "aria-selected:bg-teal-50 dark:aria-selected:bg-teal-900/20 aria-selected:text-teal-900 dark:aria-selected:text-teal-100",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
