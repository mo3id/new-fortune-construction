import * as React from 'react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './select'
import { Input } from './input'
import { Clock } from 'lucide-react'
import { cn } from '../../lib/utils'

interface BusinessHoursPickerProps {
  workingDays?: string
  workingHoursStart?: string
  workingHoursEnd?: string
  onChange: (values: {
    workingDays: string
    workingHoursStart: string
    workingHoursEnd: string
    workingHoursDisplay: string
  }) => void
  className?: string
}

const DAYS = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
]

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
  const ampm = i >= 12 ? 'PM' : 'AM'
  const hourStr = hour.toString().padStart(2, '0')
  return {
    value: `${i.toString().padStart(2, '0')}:00`,
    label: `${hourStr}:00 ${ampm}`
  }
})

// Add half-hour increments
const ALL_TIMES = HOURS.flatMap(h => {
  const [hour24] = h.value.split(':')
  const [labelHour, labelAmpm] = h.label.split(' ')
  return [
    h,
    {
      value: `${hour24}:30`,
      label: `${labelHour}:30 ${labelAmpm}`
    }
  ]
})

export function BusinessHoursPicker({
  workingDays: workingDaysProp,
  workingHoursStart: workingHoursStartProp,
  workingHoursEnd: workingHoursEndProp,
  onChange,
  className
}: BusinessHoursPickerProps) {
  const workingDays = workingDaysProp || 'Mon - Fri'
  const workingHoursStart = workingHoursStartProp || '08:00'
  const workingHoursEnd = workingHoursEndProp || '17:00'

  const [startDay, endDay] = workingDays.includes(' - ') 
    ? workingDays.split(' - ') 
    : [workingDays, workingDays]

  const formatTime = (time24: string) => {
    if (!time24) return '—'
    const [hours, minutes] = time24.split(':').map(Number)
    const ampm = hours >= 12 ? 'pm' : 'am'
    const hours12 = hours % 12 || 12
    return `${hours12}:${(minutes ?? 0).toString().padStart(2, '0')}${ampm}`
  }

  const generateDisplay = (sDay: string, eDay: string, sTime: string, eTime: string) => {
    const daysStr = sDay === eDay ? sDay : `${sDay} – ${eDay}`
    return `${daysStr}: ${formatTime(sTime)} – ${formatTime(eTime)}`
  }

  const handleUpdate = (updates: Partial<{ sDay: string, eDay: string, sTime: string, eTime: string }>) => {
    const currentSDay = updates.sDay ?? startDay
    const currentEDay = updates.eDay ?? endDay
    const currentSTime = updates.sTime ?? workingHoursStart
    const currentETime = updates.eTime ?? workingHoursEnd

    onChange({
      workingDays: currentSDay === currentEDay ? currentSDay : `${currentSDay} - ${currentEDay}`,
      workingHoursStart: currentSTime,
      workingHoursEnd: currentETime,
      workingHoursDisplay: generateDisplay(currentSDay, currentEDay, currentSTime, currentETime)
    })
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Working Days */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 ml-1">
            Working Days
          </label>
          <div className="flex items-center gap-2">
            <Select value={startDay} onValueChange={(val) => handleUpdate({ sDay: val })}>
              <SelectTrigger className="h-11 rounded-full border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-slate-300">—</span>
            <Select value={endDay} onValueChange={(val) => handleUpdate({ eDay: val })}>
              <SelectTrigger className="h-11 rounded-full border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Opens At */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 ml-1">
            Opens At
          </label>
          <Select value={workingHoursStart} onValueChange={(val) => handleUpdate({ sTime: val })}>
            <SelectTrigger className="h-11 rounded-full border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_TIMES.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Closes At */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 ml-1">
            Closes At
          </label>
          <Select value={workingHoursEnd} onValueChange={(val) => handleUpdate({ eTime: val })}>
            <SelectTrigger className="h-11 rounded-full border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_TIMES.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview Box */}
      <div className="space-y-2">
        <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 ml-1">
          Public Display Format (Auto-generated)
        </label>
        <div className="h-14 flex items-center px-6 bg-teal-50/30 dark:bg-teal-900/10 border border-teal-100/50 dark:border-teal-900/20 rounded-full text-sm font-bold text-teal-700 dark:text-teal-400 shadow-inner">
          <Clock className="w-4 h-4 mr-3 opacity-50" />
          {generateDisplay(startDay, endDay, workingHoursStart, workingHoursEnd)}
        </div>
      </div>
    </div>
  )
}
