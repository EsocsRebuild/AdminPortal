"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface BarSeries<K extends string> {
  key: K;
  label: string;
  /** CSS colour; use the --chart-N tokens so series keep their colour. */
  color: string;
}

export interface StackedBarChartProps<K extends string> {
  data: ({ label: string } & Record<K, number>)[];
  series: BarSeries<K>[];
  formatValue?: (n: number) => string;
  /** Accessible name for the chart. */
  title: string;
  className?: string;
}

function niceMax(n: number) {
  const pow = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / pow) * pow;
}

/**
 * Responsive stacked columns, built from HTML so it reflows with the layout.
 * Hover or focus a column for a tooltip; a hidden table carries the data for
 * screen readers.
 */
export function StackedBarChart<K extends string>({
  data,
  series,
  formatValue = String,
  title,
  className,
}: StackedBarChartProps<K>) {
  const [active, setActive] = React.useState<number | null>(null);
  const totals = data.map((d) => series.reduce((sum, s) => sum + d[s.key], 0));
  const max = niceMax(Math.max(...totals));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  return (
    <figure className={cn("grid gap-4", className)}>
      <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </figcaption>

      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
        {/* Y axis */}
        <div
          aria-hidden
          className="relative h-56 w-9 text-right tabular text-2xs text-subtle-foreground sm:h-64"
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0"
              style={{ bottom: `${(t / max) * 100}%`, transform: "translateY(50%)" }}
            >
              {formatValue(t)}
            </span>
          ))}
        </div>

        {/* Plot */}
        <div className="relative h-56 sm:h-64">
          {ticks.map((t) => (
            <span
              key={t}
              aria-hidden
              className={cn("absolute inset-x-0 h-px", t === 0 ? "bg-border-strong" : "bg-chart-grid")}
              style={{ bottom: `${(t / max) * 100}%` }}
            />
          ))}
          <div
            className="absolute inset-0 flex items-end gap-[clamp(3px,1.2vw,12px)]"
            onMouseLeave={() => setActive(null)}
          >
            {data.map((d, i) => (
              <div
                key={d.label}
                tabIndex={0}
                role="img"
                aria-label={`${d.label}: ${series.map((s) => `${s.label} ${formatValue(d[s.key])}`).join(", ")}; total ${formatValue(totals[i])}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group relative flex h-full flex-1 cursor-default flex-col justify-end rounded-t-[4px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div
                  className={cn(
                    "flex origin-bottom animate-grow-up flex-col-reverse gap-0.5 transition-opacity duration-200",
                    active !== null && active !== i && "opacity-45",
                  )}
                  style={{ height: `${(totals[i] / max) * 100}%`, animationDelay: `${i * 45}ms` }}
                >
                  {series.map((s, si) => (
                    <div
                      key={s.key}
                      className={cn("min-h-px w-full", si === series.length - 1 && "rounded-t-[4px]")}
                      style={{ background: s.color, flexGrow: d[s.key] }}
                    />
                  ))}
                </div>
                {active === i && (
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute bottom-full z-10 mb-2 w-max min-w-36 animate-pop-in rounded-control border border-border bg-surface-raised p-2.5 text-sm shadow-lg",
                      i < data.length / 2 ? "left-0" : "right-0",
                    )}
                    style={{ bottom: `calc(${(totals[i] / max) * 100}% + 0.5rem)` }}
                  >
                    <p className="mb-1.5 font-semibold">{d.label}</p>
                    {series.map((s) => (
                      <p
                        key={s.key}
                        className="flex items-center justify-between gap-4 text-muted-foreground"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-2 rounded-[2px]" style={{ background: s.color }} />
                          {s.label}
                        </span>
                        <span className="tabular font-medium text-foreground">{formatValue(d[s.key])}</span>
                      </p>
                    ))}
                    <p className="mt-1.5 flex justify-between gap-4 border-t border-border-subtle pt-1.5">
                      <span className="text-muted-foreground">Total</span>
                      <span className="tabular font-semibold">{formatValue(totals[i])}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* X axis */}
        <span aria-hidden />
        <div aria-hidden className="mt-2 flex gap-[clamp(3px,1.2vw,12px)] text-2xs text-subtle-foreground">
          {data.map((d, i) => (
            <span
              key={d.label}
              className={cn(
                "min-w-0 flex-1 truncate text-center",
                i % Math.ceil(data.length / 8) !== 0 && "invisible",
                i % 2 === 1 && "max-sm:invisible",
              )}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              {series.map((s) => (
                <td key={s.key}>{formatValue(d[s.key])}</td>
              ))}
              <td>{formatValue(totals[i])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
