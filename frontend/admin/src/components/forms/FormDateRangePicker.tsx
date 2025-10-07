import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";

interface FormDateRangePickerProps {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

export default function FormDateRangePicker({
  dateRange,
  onDateRangeChange,
}: FormDateRangePickerProps) {
  const presets = [
    {
      label: "Last 7 days",
      getValue: () => ({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      getValue: () => ({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: "Last 3 months",
      getValue: () => ({
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: "Last 6 months",
      getValue: () => ({
        from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: "Last year",
      getValue: () => ({
        from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset Buttons */}
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          onClick={() => onDateRangeChange(preset.getValue())}
          className="text-xs"
        >
          {preset.label}
        </Button>
      ))}

      {/* Custom Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "text-xs justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />

            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from, "MMM DD, YYYY")} -{" "}
                  {formatDate(dateRange.to, "MMM DD, YYYY")}
                </>
              ) : (
                formatDate(dateRange.from, "MMM DD, YYYY")
              )
            ) : (
              "Custom Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) =>
              onDateRangeChange({
                from: range?.from,
                to: range?.to,
              })
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
