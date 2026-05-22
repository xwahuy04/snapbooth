import { HOME_THEME_CHIPS } from '@/lib/constants/home'

export default function ThemeChips() {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2.5">
      {HOME_THEME_CHIPS.map((theme) => (
        <div
          key={theme.label}
          className="flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-2 text-xs font-medium text-muted"
        >
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
            style={{
              background: theme.bg,
              border: `2px solid ${theme.accent}`,
              boxShadow: `0 0 8px ${theme.accent}55`,
            }}
          />
          {theme.label}
        </div>
      ))}
    </div>
  )
}
