import { useEffect, useState, type ReactNode } from "react"

type Screen = "splash" | "login" | "home" | "search" | "lost-item" | "lost-details" | "review" | "success" | "found" | "item" | "match" | "verify" | "claim" | "chat" | "handover" | "returned" | "reports" | "notifications" | "profile" | "admin" | "admin-items" | "admin-claim" | "admin-handover" | "analytics" | "privacy"

type IconName = "box" | "search" | "bell" | "user" | "home" | "file" | "pin" | "calendar" | "clock" | "camera" | "chevron" | "shield" | "message" | "check" | "target" | "warning" | "menu" | "settings" | "logout" | "chart" | "users" | "close" | "send" | "arrow" | "lock"

const paths: Record<IconName, ReactNode> = {
  box: (
    <>
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" />
      <path d="M12 11v10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10M9 21v-7h6v7" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7h3l2-3h6l2 3h3v13H4z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  shield: (
    <>
      <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  message: (
    <>
      <path d="M21 14a4 4 0 0 1-4 4H8l-5 3 2-5a7 7 0 0 1-2-5V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M15 9 21 3M17 3h4v4" />
    </>
  ),
  warning: (
    <>
      <path d="m12 3 10 18H2L12 3Z" />
      <path d="M12 9v5M12 18h.01" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 13.5v-3l-2-.7-.7-1.7.9-1.9-2.1-2.1-1.9.9-1.7-.7-.7-2h-3l-.7 2-1.7.7-1.9-.9-2.1 2.1.9 1.9-.7 1.7-2 .7v3l2 .7.7 1.7-.9 1.9 2.1 2.1 1.9-.9 1.7.7.7 2h3l.7-2 1.7-.7 1.9.9 2.1-2.1-.9-1.9.7-1.7z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H4v14h6M14 8l4 4-4 4M8 12h10" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 13a5 5 0 0 1 4 5" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  send: (
    <>
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
      <path d="m11 13 4-4" />
    </>
  ),
  arrow: (
    <>
      <path d="m15 18-6-6 6-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
}

function Icon({
  name,
  size = "md",
}: {
  name: IconName
  size?: "sm" | "md" | "lg" | "xl"
}) {
  return (
    <svg
      className={`icon icon-${size}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  wide = true,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger" | "ghost"
  icon?: IconName
  wide?: boolean
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`btn btn-${variant} ${wide ? "btn-wide" : ""}`}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick?.()}
    >
      {icon && <Icon name={icon} size="sm" />}
      <span>{children}</span>
    </div>
  )
}

function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode
  tone?: "red" | "green" | "orange" | "blue" | "gray"
}) {
  return (
    <span className={`badge badge-${tone}`}>
      <span className="badge-dot" />
      {children}
    </span>
  )
}

function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={`card ${className}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

function Modal({
  icon,
  title,
  copy,
  action,
  onAction,
  onClose,
  destructive,
}: {
  icon: IconName
  title: string
  copy: string
  action: string
  onAction: () => void
  onClose: () => void
  destructive?: boolean
}) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`modal-icon ${destructive ? "danger" : ""}`}>
          <Icon name={icon} size="lg" />
        </div>
        <div className="modal-title">{title}</div>
        <p>{copy}</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={onAction}
          >
            {action}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeedbackOverlay({
  state,
  onClose,
}: {
  state: "loading" | "error" | "empty"
  onClose: () => void
}) {
  const content = {
    loading: {
      title: "Looking for your items",
      copy: "Searching verified campus reports and possible matches.",
      icon: "search" as IconName,
    },
    error: {
      title: "Something went wrong",
      copy: "We couldn’t load this information. Please check your connection and try again.",
      icon: "warning" as IconName,
    },
    empty: {
      title: "No reports yet",
      copy: "You haven’t reported any lost or found items.",
      icon: "file" as IconName,
    },
  }[state]

  return (
    <div className="feedback-backdrop" role="presentation">
      <Card className={`feedback-card feedback-${state}`}>
        {state === "loading" ? (
          <div className="loading-orbit">
            <Icon name="search" size="lg" />
          </div>
        ) : (
          <div className="feedback-icon">
            <Icon name={content.icon} size="lg" />
          </div>
        )}
        <div className="feedback-title">{content.title}</div>
        <p>{content.copy}</p>
        {state !== "loading" && (
          <Button onClick={onClose}>
            {state === "error" ? "RETRY" : "REPORT AN ITEM"}
          </Button>
        )}
        {state === "loading" && (
          <div className="loading-lines">
            <span />
            <span />
            <span />
          </div>
        )}
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  placeholder,
  icon,
  multiline,
  privateField,
}: {
  label: string
  value?: string
  placeholder?: string
  icon?: IconName
  multiline?: boolean
  privateField?: boolean
}) {
  return (
    <div className="field-wrap">
      <div className="field-label">
        {label}
        {privateField && (
          <span className="private-label">
            <Icon name="lock" size="sm" /> Private
          </span>
        )}
      </div>
      <div className={`field ${multiline ? "field-multiline" : ""}`}>
        {icon && <Icon name={icon} size="sm" />}
        <span className={value ? "" : "placeholder"}>
          {value || placeholder}
        </span>
        {!multiline && !icon && <Icon name="chevron" size="sm" />}
      </div>
    </div>
  )
}

function Toggle({ on = true }: { on?: boolean }) {
  return (
    <div className={`toggle ${on ? "toggle-on" : ""}`}>
      <span />
    </div>
  )
}

function Brand({
  compact = false,
  light = false,
}: {
  compact?: boolean
  light?: boolean
}) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <div className="brand-mark">
        <Icon name="pin" />
        <span>
          <Icon name="box" size="sm" />
        </span>
      </div>
      {!compact && (
        <div>
          <div className="brand-name">KSIT FIND</div>
          <div className="brand-tag">CAMPUS LOST &amp; FOUND</div>
        </div>
      )}
    </div>
  )
}

function TopBar({
  title,
  back,
  right,
}: {
  title?: string
  back?: () => void
  right?: ReactNode
}) {
  return (
    <div className="topbar">
      {back ? (
        <div className="icon-button" role="button" onClick={back}>
          <Icon name="arrow" />
        </div>
      ) : (
        <Brand compact={!!title} />
      )}
      {title && <div className="topbar-title">{title}</div>}
      <div className="topbar-right">{right}</div>
    </div>
  )
}

const navItems: Array<{ key: Screen label: string icon: IconName }> = [
  { key: "home", label: "Home", icon: "home" },
  { key: "search", label: "Search", icon: "search" },
  { key: "reports", label: "Reports", icon: "file" },
  { key: "profile", label: "Profile", icon: "user" },
]

function BottomNav({
  current,
  go,
}: {
  current: Screen
  go: (screen: Screen) => void
}) {
  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <div
          role="button"
          key={item.key}
          className={`nav-item ${current === item.key ? "active" : ""}`}
          onClick={() => go(item.key)}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function Progress({ step }: { step: number }) {
  const labels = ["Item", "Details", "Location", "Review"]
  return (
    <div className="progress">
      {labels.map((label, index) => (
        <div
          className={`progress-step ${index + 1 <= step ? "done" : ""}`}
          key={label}
        >
          <div>
            {index + 1 < step ? <Icon name="check" size="sm" /> : index + 1}
          </div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function StatusTimeline({ active = 3 }: { active?: number }) {
  const items = [
    "Claim submitted",
    "Identity verified",
    "Admin reviewing claim",
    "Handover scheduled",
    "Item returned",
  ]
  return (
    <div className="timeline">
      {items.map((item, index) => (
        <div
          className={`timeline-row ${
            index < active ? "complete" : index === active ? "current" : ""
          }`}
          key={item}
        >
          <div className="timeline-marker">
            {index < active ? <Icon name="check" size="sm" /> : ""}
          </div>
          <div>
            <div className="timeline-label">{item}</div>
            <div className="timeline-meta">
              {index < active
                ? "Completed"
                : index === active
                  ? "In progress"
                  : "Pending"}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const itemImages: Record<string, string> = {
  phone: "linear-gradient(140deg, #27364b 0%, #0b1220 100%)",
  backpack: "linear-gradient(140deg, #344866 0%, #172235 100%)",
  keys: "linear-gradient(140deg, #f2c14e 0%, #b87614 100%)",
  airpods: "linear-gradient(140deg, #f8fafc 0%, #dce7f3 100%)",
}

function ItemVisual({
  kind = "airpods",
  large = false,
}: {
  kind?: string
  large?: boolean
}) {
  return (
    <div
      className={`item-visual ${large ? "item-visual-large" : ""}`}
      style={{ background: itemImages[kind] }}
    >
      <div className={`object-shape object-${kind}`}>
        {kind === "airpods" ? (
          <>
            <span />
            <span />
          </>
        ) : (
          <Icon
            name={
              kind === "keys" ? "settings" : kind === "phone" ? "search" : "box"
            }
            size={large ? "xl" : "lg"}
          />
        )}
      </div>
    </div>
  )
}

function ItemCard({
  kind,
  name,
  location,
  date,
  status = "FOUND",
  tone = "green",
  onClick,
}: {
  kind: string
  name: string
  location: string
  date: string
  status?: string
  tone?: "red" | "green" | "orange" | "blue" | "gray"
  onClick?: () => void
}) {
  return (
    <Card className="item-card" onClick={onClick}>
      <ItemVisual kind={kind} />
      <div className="item-card-copy">
        <div className="item-row">
          <div className="item-name">{name}</div>
          <Badge tone={tone}>{status}</Badge>
        </div>
        <div className="item-meta">
          <span>
            <Icon name="pin" size="sm" />
            {location}
          </span>
          <span>
            <Icon name="calendar" size="sm" />
            {date}
          </span>
        </div>
      </div>
      <Icon name="chevron" size="sm" />
    </Card>
  )
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="section-title">
      <span>{title}</span>
      {action && (
        <div role="button" className="text-action" onClick={onAction}>
          {action}
        </div>
      )}
    </div>
  )
}

function Splash({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="splash-screen">
      <div className="splash-orbit orbit-one" />
      <div className="splash-orbit orbit-two" />
      <div className="splash-content">
        <div className="splash-mark">
          <Icon name="pin" size="xl" />
          <span>
            <Icon name="box" size="lg" />
          </span>
        </div>
        <div className="splash-name">KSIT FIND</div>
        <div className="splash-subtitle">Campus Lost &amp; Found</div>
        <div className="splash-rule" />
        <div className="splash-tagline">
          Lost something? Found something?
          <br />
          Let&apos;s bring it back.
        </div>
        <div className="splash-status">
          LOST <span /> FOUND <span /> RETURNED
        </div>
      </div>
      <div className="splash-bottom">
        <Button onClick={() => go("login")} variant="secondary">
          GET STARTED
        </Button>
        <span>Powered by KSIT</span>
      </div>
    </div>
  )
}

function Login({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="login-screen">
      <div className="login-hero">
        <Brand light />
        <div className="hero-illustration">
          <div className="hero-pin">
            <Icon name="pin" size="xl" />
          </div>
          <div className="hero-card card-a">
            <Icon name="search" />
            <span>Search campus-wide</span>
          </div>
          <div className="hero-card card-b">
            <Icon name="shield" />
            <span>Verified handovers</span>
          </div>
        </div>
        <div className="login-quote">
          Lost something? Found something?
          <br />
          Let&apos;s bring it back.
        </div>
      </div>
      <div className="login-panel">
        <div className="login-mobile-brand">
          <Brand />
        </div>
        <div className="eyebrow">WELCOME BACK</div>
        <div className="page-title">Welcome to KSIT FIND</div>
        <p className="page-subtitle">
          Sign in with your KSIT account to continue.
        </p>
        <div className="form-stack">
          <Field label="College Email" value="rahul.kumar@ksit.edu.in" />
          <Field label="Password" value="••••••••••" />
          <div className="form-link">Forgot Password?</div>
          <Button onClick={() => go("home")}>LOGIN</Button>
          <div className="divider">
            <span>OR</span>
          </div>
          <Button variant="secondary" icon="shield" onClick={() => go("home")}>
            Continue with KSIT Account
          </Button>
        </div>
        <div className="help-row">Need Help?</div>
        <div className="secure-note">
          <Icon name="lock" size="sm" />
          <span>
            Only authorized KSIT students and staff can access the platform.
          </span>
        </div>
      </div>
    </div>
  )
}

function Home({ go }: { go: (s: Screen) => void }) {
  return (
    <MobilePage current="home" go={go}>
      <div className="home-header">
        <div className="home-top">
          <Brand />
          <div className="top-actions">
            <div
              className="icon-button notification-button"
              role="button"
              onClick={() => go("notifications")}
            >
              <Icon name="bell" />
              <span />
            </div>
            <div className="avatar" role="button" onClick={() => go("profile")}>
              RK
            </div>
          </div>
        </div>
        <div className="greeting">
          <div className="eyebrow">THURSDAY, 2 OCTOBER</div>
          <div className="page-title">
            Good morning, Rahul <span aria-label="wave">👋</span>
          </div>
          <p>Find what you&apos;ve lost. Return what you&apos;ve found.</p>
        </div>
        <div className="search-box" role="button" onClick={() => go("search")}>
          <Icon name="search" />
          <span>Search lost &amp; found items</span>
          <div className="search-shortcut">⌘ K</div>
        </div>
      </div>
      <div className="mobile-content home-content">
        <div className="action-grid">
          <Card
            className="action-card lost-action"
            onClick={() => go("lost-item")}
          >
            <div className="action-icon">
              <Icon name="search" size="lg" />
            </div>
            <div className="action-kicker">LOST SOMETHING?</div>
            <div className="action-copy">Report an item you lost</div>
            <div className="action-link">
              REPORT LOST <Icon name="chevron" size="sm" />
            </div>
          </Card>
          <Card
            className="action-card found-action"
            onClick={() => go("found")}
          >
            <div className="action-icon">
              <Icon name="box" size="lg" />
            </div>
            <div className="action-kicker">FOUND SOMETHING?</div>
            <div className="action-copy">Help return an item</div>
            <div className="action-link">
              REPORT FOUND <Icon name="chevron" size="sm" />
            </div>
          </Card>
        </div>
        <div className="match-banner" role="button" onClick={() => go("match")}>
          <div className="match-icon">
            <Icon name="target" />
          </div>
          <div>
            <strong>We found a possible match</strong>
            <span>Your AirPods report has a new match</span>
          </div>
          <Icon name="chevron" />
        </div>
        <SectionTitle
          title="RECENTLY REPORTED"
          action="View all"
          onAction={() => go("search")}
        />
        <div className="item-list">
          <ItemCard
            kind="phone"
            name="Black Smartphone"
            location="Library"
            date="Today"
            onClick={() => go("item")}
          />
          <ItemCard
            kind="backpack"
            name="Black Backpack"
            location="Academic Block"
            date="Yesterday"
            onClick={() => go("item")}
          />
          <ItemCard
            kind="keys"
            name="Keychain"
            location="Canteen"
            date="Yesterday"
            onClick={() => go("item")}
          />
        </div>
      </div>
    </MobilePage>
  )
}

function MobilePage({
  children,
  current,
  go,
}: {
  children: ReactNode
  current?: Screen
  go: (s: Screen) => void
}) {
  return (
    <div className="mobile-page">
      {children}
      {current && <BottomNav current={current} go={go} />}
    </div>
  )
}

function SearchScreen({ go }: { go: (s: Screen) => void }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const chips = [
    "All",
    "Lost",
    "Found",
    "Electronics",
    "Bags",
    "ID Cards",
    "Books",
    "Keys",
    "Other",
  ]
  return (
    <MobilePage current="search" go={go}>
      <div className="sticky-head">
        <TopBar title="Search Lost & Found" />
        <div className="search-box active">
          <Icon name="search" />
          <span>What are you looking for?</span>
          <div
            className="filter-icon"
            role="button"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Icon name="settings" size="sm" />
          </div>
        </div>
        <div className="chips">
          {chips.map((chip, index) => (
            <div className={`chip ${index === 0 ? "selected" : ""}`} key={chip}>
              {chip}
            </div>
          ))}
        </div>
      </div>
      <div className="mobile-content">
        <div className="result-heading">
          <span>86 results</span>
          <span>
            Most relevant <Icon name="chevron" size="sm" />
          </span>
        </div>
        {filterOpen && (
          <Card className="filter-panel">
            <div className="filter-title">Advanced filters</div>
            <div className="filter-grid">
              {["Category", "Location", "Date", "Color", "Status"].map(
                (label) => (
                  <Field
                    key={label}
                    label={label}
                    placeholder={`Any ${label.toLowerCase()}`}
                  />
                ),
              )}
            </div>
            <Button onClick={() => setFilterOpen(false)}>APPLY FILTERS</Button>
          </Card>
        )}
        <Card className="result-featured" onClick={() => go("item")}>
          <ItemVisual kind="airpods" large />
          <div className="result-content">
            <div className="item-row">
              <Badge tone="green">FOUND</Badge>
              <Badge tone="blue">Possible Match</Badge>
            </div>
            <div className="result-title">Black AirPods Pro</div>
            <div className="item-meta vertical">
              <span>
                <Icon name="pin" size="sm" />
                Canteen
              </span>
              <span>
                <Icon name="calendar" size="sm" />
                02 Oct 2026
              </span>
            </div>
            <Button wide={false} onClick={() => go("item")}>
              VIEW DETAILS
            </Button>
          </div>
        </Card>
        <div className="item-list">
          <ItemCard
            kind="backpack"
            name="Navy College Backpack"
            location="Main Block"
            date="02 Oct 2026"
          />
          <ItemCard
            kind="phone"
            name="Samsung Smartphone"
            location="Library"
            date="01 Oct 2026"
          />
          <ItemCard
            kind="keys"
            name="Bike Key with Tag"
            location="Parking"
            date="30 Sep 2026"
          />
        </div>
      </div>
    </MobilePage>
  )
}

function FormShell({
  title,
  step,
  children,
  go,
}: {
  title: string
  step?: number
  children: ReactNode
  go: (s: Screen) => void
}) {
  return (
    <MobilePage go={go}>
      <TopBar title={title} back={() => go("home")} />
      {step && <Progress step={step} />}
      <div className="mobile-content form-content">{children}</div>
    </MobilePage>
  )
}

function ReportLostItem({ go }: { go: (s: Screen) => void }) {
  return (
    <FormShell title="Report Lost Item" step={1} go={go}>
      <div className="form-heading">What did you lose?</div>
      <p className="form-description">
        Start with the basics. You can finish this report in under a minute.
      </p>
      <div className="form-stack">
        <Field label="Category" value="Electronics" />
        <Field label="Item name" value="AirPods Pro" />
        <div className="field-row">
          <Field label="Brand" value="Apple" />
          <Field label="Color" value="White" />
        </div>
        <div className="field-label">
          Add image <span className="optional">Optional</span>
        </div>
        <div className="photo-drop">
          <Icon name="camera" size="lg" />
          <strong>+ Add Photo</strong>
          <span>A clear photo helps us find matches</span>
        </div>
      </div>
      <div className="button-row">
        <Button variant="secondary" onClick={() => go("home")}>
          BACK
        </Button>
        <Button onClick={() => go("lost-details")}>NEXT</Button>
      </div>
    </FormShell>
  )
}

function LostDetails({ go }: { go: (s: Screen) => void }) {
  return (
    <FormShell title="Lost Item Details" step={2} go={go}>
      <div className="form-heading">When and where?</div>
      <p className="form-description">
        Approximate details are fine. They help narrow down possible matches.
      </p>
      <div className="form-stack">
        <div className="field-row">
          <Field label="Date Lost" value="02 Oct 2026" icon="calendar" />
          <Field label="Approx. Time" value="1:15 PM" icon="clock" />
        </div>
        <Field label="Where did you lose it?" value="Canteen" />
        <Field
          label="Describe your item"
          value="White Apple AirPods Pro and charging case."
          multiline
        />
        <Field
          label="Private identifying details"
          value="Small scratch underneath the charging case."
          multiline
          privateField
        />
        <div className="privacy-tip">
          <Icon name="shield" />
          <span>
            <strong>Kept private</strong>These details are hidden from public
            listings and used only to verify ownership.
          </span>
        </div>
      </div>
      <div className="button-row">
        <Button variant="secondary" onClick={() => go("lost-item")}>
          BACK
        </Button>
        <Button onClick={() => go("review")}>REVIEW</Button>
      </div>
    </FormShell>
  )
}

function Review({
  go,
  onSubmit,
}: {
  go: (s: Screen) => void
  onSubmit: () => void
}) {
  const rows = [
    ["Category", "Electronics"],
    ["Color", "White"],
    ["Location", "Canteen"],
    ["Date", "02 Oct 2026"],
    ["Time", "1:15 PM"],
  ]
  return (
    <FormShell title="Review Your Report" step={4} go={go}>
      <p className="form-description">
        Check the details before submitting. Private information won&apos;t
        appear publicly.
      </p>
      <Card className="review-card">
        <div className="review-top">
          <ItemVisual kind="airpods" />
          <div>
            <Badge tone="red">LOST</Badge>
            <div className="review-name">Apple AirPods Pro</div>
          </div>
        </div>
        <div className="review-rows">
          {rows.map(([label, value]) => (
            <div className="review-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="review-description">
          <span>Description</span>
          <p>White AirPods Pro with a small scratch underneath the case.</p>
        </div>
        <div className="privacy-inline">
          <Icon name="lock" size="sm" /> Private details protected
        </div>
      </Card>
      <div className="button-row">
        <Button variant="secondary" onClick={() => go("lost-details")}>
          EDIT
        </Button>
        <Button onClick={onSubmit}>SUBMIT REPORT</Button>
      </div>
    </FormShell>
  )
}

function Success({
  go,
  kind,
}: {
  go: (s: Screen) => void
  kind: "lost" | "found"
}) {
  const isFound = kind === "found"
  return (
    <div className="center-screen">
      <div className="success-rings">
        <div className="success-icon">
          <Icon name="check" size="xl" />
        </div>
      </div>
      <Badge tone="green">REPORT ACTIVE</Badge>
      <div className="center-title">
        {isFound ? "Found item submitted!" : "Lost report submitted!"}
      </div>
      <p>
        {isFound
          ? "Thank you for helping. KSIT staff will review the item and look for its owner."
          : "We’ll automatically look for possible matches and notify you if something similar is found."}
      </p>
      <Card className="report-id">
        <span>REPORT ID</span>
        <strong>{isFound ? "FD-2026-00487" : "LF-2026-00128"}</strong>
        <div className="copy-icon">
          <Icon name="file" size="sm" />
        </div>
      </Card>
      {!isFound && (
        <div
          className="instant-match"
          role="button"
          onClick={() => go("match")}
        >
          <div>
            <Icon name="target" />
          </div>
          <span>
            <strong>Possible match detected</strong>A similar AirPods report is
            ready to review
          </span>
          <Icon name="chevron" />
        </div>
      )}
      <div className="center-actions">
        <Button onClick={() => go("reports")}>VIEW REPORT</Button>
        <Button variant="secondary" onClick={() => go("home")}>
          BACK TO HOME
        </Button>
      </div>
    </div>
  )
}

function FoundForm({
  go,
  onSubmit,
}: {
  go: (s: Screen) => void
  onSubmit: () => void
}) {
  return (
    <FormShell title="Report Found Item" go={go}>
      <div className="speed-note">
        <Icon name="clock" />
        <span>
          <strong>Quick report</strong>This usually takes less than one minute.
        </span>
      </div>
      <div className="form-heading">What did you find?</div>
      <div className="form-stack">
        <div className="field-row">
          <Field label="Category" value="Electronics" />
          <Field label="Color" value="White" />
        </div>
        <Field label="Item name" value="AirPods Pro" />
        <Field label="Location found" value="Canteen" />
        <div className="field-row">
          <Field label="Date found" value="02 Oct 2026" icon="calendar" />
          <Field label="Time found" value="1:40 PM" icon="clock" />
        </div>
        <div className="photo-drop compact">
          <Icon name="camera" />
          <strong>Add a photo</strong>
        </div>
        <Field
          label="Description"
          value="White AirPods Pro found near the west entrance."
          multiline
        />
        <div className="field-label">Where is the item currently?</div>
        <div className="radio-list">
          {[
            "With me",
            "Submitted to Lost & Found Desk",
            "With Security",
            "Other",
          ].map((item, index) => (
            <div className="radio-row" key={item}>
              <span className={`radio ${index === 1 ? "selected" : ""}`} />
              {item}
            </div>
          ))}
        </div>
        <div className="privacy-tip">
          <Icon name="shield" />
          <span>
            <strong>Keep it safe</strong>Don&apos;t share serial numbers or
            private identifying details publicly.
          </span>
        </div>
        <Button onClick={onSubmit}>SUBMIT FOUND ITEM</Button>
      </div>
    </FormShell>
  )
}

function ItemDetails({ go }: { go: (s: Screen) => void }) {
  const [reportDialog, setReportDialog] = useState(false)
  return (
    <MobilePage go={go}>
      <div className="detail-hero">
        <TopBar
          back={() => go("search")}
          right={
            <div className="icon-button">
              <Icon name="file" />
            </div>
          }
        />
        <ItemVisual kind="airpods" large />
        <Badge tone="green">FOUND</Badge>
      </div>
      <div className="mobile-content detail-content">
        <div className="page-title">White AirPods Pro</div>
        <div className="detail-id">ITEM #FD-2026-00487</div>
        <div className="detail-grid">
          <div>
            <span>Category</span>
            <strong>Electronics</strong>
          </div>
          <div>
            <span>Found</span>
            <strong>02 Oct 2026</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>Canteen</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>At L&amp;F Desk</strong>
          </div>
        </div>
        <SectionTitle title="DESCRIPTION" />
        <p className="detail-description">
          White Apple AirPods Pro found near the canteen west entrance. Stored
          securely at the campus Lost &amp; Found Desk.
        </p>
        <div className="privacy-tip">
          <Icon name="shield" />
          <span>
            <strong>Privacy protected</strong>Sensitive identifying information
            is hidden from this public listing.
          </span>
        </div>
        <SectionTitle title="ITEM STATUS" />
        <Card className="item-lifecycle">
          {["Reported", "Secured at desk", "Ownership claim", "Returned"].map(
            (label, index) => (
              <div
                className={`lifecycle-step ${index < 2 ? "complete" : ""} ${
                  index === 2 ? "current" : ""
                }`}
                key={label}
              >
                <span>
                  {index < 2 ? <Icon name="check" size="sm" /> : index + 1}
                </span>
                <strong>{label}</strong>
              </div>
            ),
          )}
        </Card>
        <Card className="claim-card">
          <div className="claim-icon">
            <Icon name="target" />
          </div>
          <div className="form-heading">Think this is yours?</div>
          <p>
            Submit a secure ownership claim. We&apos;ll ask for details only the
            owner would know.
          </p>
          <Button onClick={() => go("verify")}>CLAIM THIS ITEM</Button>
          <Button variant="ghost" onClick={() => setReportDialog(true)}>
            REPORT LISTING
          </Button>
        </Card>
      </div>
      {reportDialog && (
        <Modal
          icon="warning"
          title="Report this listing?"
          copy="KSIT staff will review this listing for inaccurate, unsafe, or inappropriate information."
          action="SUBMIT REPORT"
          destructive
          onClose={() => setReportDialog(false)}
          onAction={() => setReportDialog(false)}
        />
      )}
    </MobilePage>
  )
}

function Match({ go }: { go: (s: Screen) => void }) {
  return (
    <MobilePage go={go}>
      <TopBar title="SMART MATCH" back={() => go("home")} />
      <div className="mobile-content">
        <div className="match-heading">
          <div className="target-rings">
            <Icon name="target" size="xl" />
          </div>
          <div className="page-title">
            We may have found a match! <span aria-label="target">🎯</span>
          </div>
          <p>Our matching system found an item similar to your lost report.</p>
        </div>
        <div className="comparison">
          <Card>
            <div className="comparison-label">YOUR LOST ITEM</div>
            <ItemVisual kind="airpods" />
            <strong>White AirPods Pro</strong>
            <Badge tone="red">LOST</Badge>
          </Card>
          <div className="versus">VS</div>
          <Card>
            <div className="comparison-label">POSSIBLE FOUND ITEM</div>
            <ItemVisual kind="airpods" />
            <strong>White Apple AirPods Pro</strong>
            <Badge tone="green">FOUND</Badge>
          </Card>
        </div>
        <Card className="match-factors">
          <div className="section-title">
            <span>WHY IT MATCHES</span>
            <Badge tone="blue">92% MATCH</Badge>
          </div>
          {["Same category", "Same color", "Similar location", "Same date"].map(
            (factor) => (
              <div className="factor" key={factor}>
                <span>
                  <Icon name="check" size="sm" />
                </span>
                {factor}
              </div>
            ),
          )}
        </Card>
        <div className="privacy-tip">
          <Icon name="lock" />
          <span>
            Some identifying details are hidden until ownership is verified.
          </span>
        </div>
        <div className="form-stack">
          <Button onClick={() => go("verify")}>VERIFY OWNERSHIP</Button>
          <Button variant="secondary" onClick={() => go("home")}>
            NOT MY ITEM
          </Button>
        </div>
      </div>
    </MobilePage>
  )
}

function Verify({ go }: { go: (s: Screen) => void }) {
  return (
    <FormShell title="Verify Ownership" go={go}>
      <div className="verify-mark">
        <Icon name="shield" size="xl" />
      </div>
      <div className="form-heading center-text">
        Help us confirm it&apos;s yours
      </div>
      <p className="form-description center-text">
        Answer a few private questions. Your responses will never appear
        publicly.
      </p>
      <div className="form-stack">
        <Field
          label="What identifying feature does your item have?"
          placeholder="Describe a mark, scratch, or unique detail"
          multiline
          privateField
        />
        <Field
          label="What was the approximate time you lost it?"
          value="1:15 PM"
          icon="clock"
        />
        <Field
          label="Where exactly did you last see it?"
          value="Near the west-side juice counter"
          multiline
          privateField
        />
        <div className="upload-proof">
          <Icon name="camera" />
          <div>
            <strong>Upload proof of ownership</strong>
            <span>Receipt, box, or a previous photo (optional)</span>
          </div>
          <Icon name="chevron" size="sm" />
        </div>
        <div className="privacy-tip">
          <Icon name="lock" />
          <span>
            Your answers are encrypted and only used by authorized staff to
            verify ownership.
          </span>
        </div>
        <Button onClick={() => go("claim")}>SUBMIT CLAIM</Button>
      </div>
    </FormShell>
  )
}

function ClaimStatus({ go }: { go: (s: Screen) => void }) {
  return (
    <MobilePage go={go}>
      <TopBar
        title="Claim Status"
        back={() => go("reports")}
        right={
          <div className="icon-button" role="button" onClick={() => go("chat")}>
            <Icon name="message" />
          </div>
        }
      />
      <div className="mobile-content">
        <Card className="claim-item">
          <ItemVisual kind="airpods" />
          <div>
            <Badge tone="orange">UNDER REVIEW</Badge>
            <div className="item-name">White AirPods Pro</div>
            <span>Claim #CL-2026-00042</span>
          </div>
        </Card>
        <Card className="status-card">
          <div className="status-card-head">
            <span>Claim progress</span>
            <span>Step 3 of 5</span>
          </div>
          <StatusTimeline active={2} />
        </Card>
        <div className="privacy-tip blue">
          <Icon name="clock" />
          <span>
            <strong>Usually reviewed within 24 hours</strong>We&apos;ll notify
            you when the admin has reviewed your claim.
          </span>
        </div>
        <Button icon="message" variant="secondary" onClick={() => go("chat")}>
          OPEN ITEM DISCUSSION
        </Button>
      </div>
    </MobilePage>
  )
}

function Chat({ go }: { go: (s: Screen) => void }) {
  return (
    <MobilePage go={go}>
      <TopBar
        title="Item Discussion"
        back={() => go("claim")}
        right={<div className="avatar small">LF</div>}
      />
      <div className="chat-context">
        <ItemVisual kind="airpods" />
        <div>
          <strong>White AirPods Pro</strong>
          <span>Claim #CL-2026-00042</span>
        </div>
        <Badge tone="orange">REVIEW</Badge>
      </div>
      <div className="safety-strip">
        <Icon name="shield" size="sm" />
        For your privacy, phone numbers and email addresses are hidden.
      </div>
      <div className="messages">
        <div className="date-separator">TODAY</div>
        <div className="bubble mine">
          Hi, I think this might be my AirPods.<span>1:18 PM</span>
        </div>
        <div className="bubble theirs">
          Can you describe the identifying mark?<span>1:20 PM</span>
        </div>
        <div className="bubble mine">
          There is a small scratch underneath the case.
          <span>1:22 PM · Read</span>
        </div>
        <div className="bubble theirs">
          Thank you. The admin team will compare this privately with the found
          item.<span>1:24 PM</span>
        </div>
      </div>
      <div className="composer">
        <div className="composer-field">Type a message...</div>
        <div className="send-button">
          <Icon name="send" />
        </div>
      </div>
    </MobilePage>
  )
}

function Handover({ go }: { go: (s: Screen) => void }) {
  const cells = Array.from(
    { length: 81 },
    (_, index) => (index * 7 + index * index) % 5 < 2,
  )
  return (
    <MobilePage go={go}>
      <TopBar title="Item Handover" back={() => go("claim")} />
      <div className="mobile-content">
        <div className="handover-status">
          <div className="success-icon small">
            <Icon name="check" />
          </div>
          <div>
            <strong>Handover scheduled</strong>
            <span>Your claim has been approved</span>
          </div>
        </div>
        <Card className="handover-item">
          <ItemVisual kind="airpods" />
          <div>
            <div className="item-name">White AirPods Pro</div>
            <span>Item #FD-2026-00487</span>
          </div>
          <Badge tone="blue">READY</Badge>
        </Card>
        <Card className="appointment-card">
          <div className="appointment-title">
            <Icon name="pin" />
            KSIT Lost &amp; Found Desk
          </div>
          <div className="appointment-grid">
            <div>
              <Icon name="calendar" />
              <span>
                Date<strong>03 Oct 2026</strong>
              </span>
            </div>
            <div>
              <Icon name="clock" />
              <span>
                Time<strong>1:30 PM</strong>
              </span>
            </div>
          </div>
        </Card>
        <div className="qr-card">
          <div className="qr-label">COLLECTION PASS</div>
          <div className="qr-code">
            {cells.map((filled, index) => (
              <span className={filled ? "filled" : ""} key={index} />
            ))}
          </div>
          <span>HANDOVER CODE</span>
          <strong>739281</strong>
          <p>
            Show this QR code or code to authorized KSIT staff during
            collection.
          </p>
        </div>
        <Button variant="secondary" onClick={() => go("returned")}>
          VIEW HANDOVER DETAILS
        </Button>
      </div>
    </MobilePage>
  )
}

function Returned({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="center-screen celebration">
      <div className="confetti c1" />
      <div className="confetti c2" />
      <div className="confetti c3" />
      <div className="success-rings">
        <div className="success-icon">
          <Icon name="check" size="xl" />
        </div>
      </div>
      <div className="center-title">
        Item Returned! <span aria-label="celebrate">🎉</span>
      </div>
      <p>
        Your item has been successfully returned and the report has been closed.
      </p>
      <Card className="returned-card">
        <ItemVisual kind="airpods" />
        <div>
          <strong>White AirPods Pro</strong>
          <span>Returned</span>
          <span>03 Oct 2026 • 1:42 PM</span>
        </div>
        <Badge tone="green">RETURNED</Badge>
      </Card>
      <div className="impact-stat">
        <strong>52</strong>
        <span>items reunited with owners this semester</span>
      </div>
      <div className="center-actions">
        <Button onClick={() => go("home")}>DONE</Button>
      </div>
    </div>
  )
}

function Reports({ go }: { go: (s: Screen) => void }) {
  return (
    <MobilePage current="reports" go={go}>
      <TopBar
        title="My Reports"
        right={
          <div className="icon-button">
            <Icon name="search" />
          </div>
        }
      />
      <div className="tabs">
        <div className="active">
          Lost <span>2</span>
        </div>
        <div>
          Found <span>1</span>
        </div>
        <div>
          Claims <span>1</span>
        </div>
      </div>
      <div className="mobile-content">
        <div className="item-list">
          <ReportCard
            name="White AirPods Pro"
            kind="airpods"
            type="Lost"
            status="SEARCHING"
            tone="orange"
            progress={38}
            onClick={() => go("claim")}
          />
          <ReportCard
            name="Black Backpack"
            kind="backpack"
            type="Lost"
            status="MATCH FOUND"
            tone="blue"
            progress={68}
            onClick={() => go("match")}
          />
          <ReportCard
            name="Brown Wallet"
            kind="keys"
            type="Found"
            status="RETURNED"
            tone="green"
            progress={100}
          />
        </div>
        <Card className="empty-state">
          <div className="empty-icon">
            <Icon name="file" />
          </div>
          <strong>Need to report another item?</strong>
          <span>It takes less than one minute.</span>
          <Button wide={false} onClick={() => go("lost-item")}>
            REPORT AN ITEM
          </Button>
        </Card>
      </div>
    </MobilePage>
  )
}

function ReportCard({
  name,
  kind,
  type,
  status,
  tone,
  progress,
  onClick,
}: {
  name: string
  kind: string
  type: string
  status: string
  tone: "orange" | "blue" | "green"
  progress: number
  onClick?: () => void
}) {
  return (
    <Card className="report-card" onClick={onClick}>
      <div className="report-main">
        <ItemVisual kind={kind} />
        <div>
          <div className="item-name">{name}</div>
          <span>{type} • 02 Oct 2026</span>
        </div>
        <Badge tone={tone}>{status}</Badge>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="report-foot">
        <span>
          {progress === 100
            ? "Report closed"
            : progress > 50
              ? "Possible match waiting"
              : "Searching campus reports"}
        </span>
        <Icon name="chevron" size="sm" />
      </div>
    </Card>
  )
}

function Notifications({ go }: { go: (s: Screen) => void }) {
  const notes: Array<[IconName, string, string, string, Screen]> = [
    [
      "target",
      "Possible match found",
      "A found item may match your AirPods report.",
      "Just now",
      "match",
    ],
    [
      "check",
      "Claim approved",
      "Your ownership claim has been approved.",
      "12 min ago",
      "handover",
    ],
    [
      "message",
      "New message",
      "The finder responded to your message.",
      "1 hour ago",
      "chat",
    ],
    [
      "pin",
      "Handover scheduled",
      "Your item collection has been scheduled.",
      "Yesterday",
      "handover",
    ],
    [
      "box",
      "Item returned",
      "Your lost item has been successfully returned.",
      "2 days ago",
      "returned",
    ],
  ]
  return (
    <MobilePage go={go}>
      <TopBar
        title="Notifications"
        back={() => go("home")}
        right={<div className="text-action">Mark all read</div>}
      />
      <div className="mobile-content">
        <div className="notification-group-label">NEW</div>
        {notes.map(([icon, title, copy, time, screen], index) => (
          <Card
            className={`notification-card ${index < 2 ? "unread" : ""}`}
            onClick={() => go(screen)}
            key={title}
          >
            <div className={`notification-icon note-${index}`}>
              <Icon name={icon} />
            </div>
            <div>
              <strong>{title}</strong>
              <p>{copy}</p>
              <span>{time}</span>
            </div>
            <Icon name="chevron" size="sm" />
          </Card>
        ))}
      </div>
    </MobilePage>
  )
}

function Profile({ go }: { go: (s: Screen) => void }) {
  const [logoutDialog, setLogoutDialog] = useState(false)
  const menus: Array<[IconName, string, Screen]> = [
    ["file", "My Reports", "reports"],
    ["shield", "My Claims", "claim"],
    ["message", "Messages", "chat"],
    ["bell", "Notifications", "notifications"],
    ["settings", "Security & Privacy", "privacy"],
    ["users", "Help & Support", "home"],
  ]
  return (
    <MobilePage current="profile" go={go}>
      <TopBar title="My Profile" />
      <div className="profile-hero">
        <div className="profile-avatar">
          RK
          <span>
            <Icon name="camera" size="sm" />
          </span>
        </div>
        <div className="profile-name">Rahul Kumar</div>
        <span>1KS23CS001</span>
        <p>
          Computer Science &amp; Engineering
          <br />
          7th Semester
        </p>
      </div>
      <div className="stats-row">
        <div>
          <strong>3</strong>
          <span>Lost</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Found</span>
        </div>
        <div>
          <strong>1</strong>
          <span>Returned</span>
        </div>
      </div>
      <div className="mobile-content profile-content">
        <Card className="menu-card">
          {menus.map(([icon, label, target]) => (
            <div
              className="menu-row"
              role="button"
              onClick={() => go(target)}
              key={label}
            >
              <div className="menu-icon">
                <Icon name={icon} />
              </div>
              <span>{label}</span>
              <Icon name="chevron" size="sm" />
            </div>
          ))}
        </Card>
        <Button
          variant="danger"
          icon="logout"
          onClick={() => setLogoutDialog(true)}
        >
          LOGOUT
        </Button>
        <div className="admin-link" role="button" onClick={() => go("admin")}>
          <Icon name="shield" size="sm" /> Open KSIT Admin Portal
        </div>
      </div>
      {logoutDialog && (
        <Modal
          icon="logout"
          title="Log out of KSIT FIND?"
          copy="You’ll need to sign in with your authorized KSIT account to access reports and messages again."
          action="LOGOUT"
          destructive
          onClose={() => setLogoutDialog(false)}
          onAction={() => go("login")}
        />
      )}
    </MobilePage>
  )
}

function Privacy({ go }: { go: (s: Screen) => void }) {
  return (
    <MobilePage go={go}>
      <TopBar title="Security & Privacy" back={() => go("profile")} />
      <div className="mobile-content">
        <div className="privacy-hero">
          <Icon name="shield" size="xl" />
          <div className="form-heading">Your privacy comes first</div>
          <p>Control how your information is used across KSIT FIND.</p>
        </div>
        <SectionTitle title="VISIBILITY" />
        <Card className="settings-card">
          <SettingRow title="Profile Visibility" value="Private" />
          <SettingRow title="Phone Number Visibility" value="Hidden" />
          <SettingRow title="Email Visibility" value="Hidden" />
        </Card>
        <SectionTitle title="COMMUNICATION" />
        <Card className="settings-card">
          <SettingRow title="Allow Finder to Contact Me" toggle />
          <SettingRow title="Notification Preferences" toggle />
        </Card>
        <div className="privacy-notice">
          <Icon name="lock" />
          <p>
            <strong>Privacy notice</strong>KSIT FIND only displays information
            necessary to help recover an item. Sensitive details, IDs, phone
            numbers, and private ownership information are protected.
          </p>
        </div>
        <Button variant="secondary">VIEW PRIVACY POLICY</Button>
      </div>
    </MobilePage>
  )
}

function SettingRow({
  title,
  value,
  toggle,
}: {
  title: string
  value?: string
  toggle?: boolean
}) {
  return (
    <div className="setting-row">
      <span>{title}</span>
      {toggle ? (
        <Toggle />
      ) : (
        <div>
          {value}
          <Icon name="chevron" size="sm" />
        </div>
      )}
    </div>
  )
}

const sidebarItems: Array<[IconName, string, Screen]> = [
  ["home", "Dashboard", "admin"],
  ["box", "Items", "admin-items"],
  ["search", "Lost Reports", "admin-items"],
  ["file", "Found Reports", "admin-items"],
  ["shield", "Claims", "admin-claim"],
  ["pin", "Handovers", "admin-handover"],
  ["users", "Users", "admin-items"],
  ["warning", "Reports & Abuse", "admin-items"],
  ["chart", "Analytics", "analytics"],
  ["settings", "Settings", "privacy"],
]

function AdminLayout({
  children,
  current,
  go,
  title,
  subtitle,
}: {
  children: ReactNode
  current: Screen
  go: (s: Screen) => void
  title: string
  subtitle: string
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand light />
        <div className="admin-label">ADMIN PORTAL</div>
        <div className="sidebar-nav">
          {sidebarItems.map(([icon, label, target]) => (
            <div
              className={`sidebar-item ${current === target ? "active" : ""}`}
              role="button"
              onClick={() => go(target)}
              key={label}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {label === "Claims" && <b>17</b>}
            </div>
          ))}
        </div>
        <div className="admin-user">
          <div className="avatar">AS</div>
          <div>
            <strong>Admin Staff</strong>
            <span>Lost &amp; Found Desk</span>
          </div>
          <Icon name="chevron" size="sm" />
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-title">{title}</div>
            <p>{subtitle}</p>
          </div>
          <div className="top-actions">
            <div className="search-mini">
              <Icon name="search" size="sm" />
              Search
            </div>
            <div className="icon-button notification-button">
              <Icon name="bell" />
              <span />
            </div>
            <div className="avatar">AS</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

function AdminDashboard({ go }: { go: (s: Screen) => void }) {
  const metrics: Array<[string, string, string, IconName]> = [
    ["124", "Total Items", "+12 this month", "box"],
    ["78", "Lost", "63% of reports", "search"],
    ["46", "Found", "37% of reports", "file"],
    ["17", "Pending Claims", "Needs attention", "shield"],
    ["51", "Returned", "41% recovery rate", "check"],
    ["12", "Pending Reviews", "4 urgent", "clock"],
  ]
  return (
    <AdminLayout
      current="admin"
      go={go}
      title="Dashboard"
      subtitle="Campus lost & found overview • 02 October 2026"
    >
      <div className="admin-content">
        <div className="metric-grid">
          {metrics.map(([value, label, note, icon], index) => (
            <Card className={`metric-card metric-${index}`} key={label}>
              <div className="metric-icon">
                <Icon name={icon} />
              </div>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{note}</small>
              </div>
            </Card>
          ))}
        </div>
        <div className="chart-grid">
          <Card className="chart-card wide">
            <div className="chart-head">
              <div>
                <strong>Monthly activity</strong>
                <span>Lost, found and returned items</span>
              </div>
              <div className="chart-legend">
                <span className="lost">Lost</span>
                <span className="found">Found</span>
                <span className="returned">Returned</span>
              </div>
            </div>
            <div className="line-chart">
              <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                <path
                  className="gridline"
                  d="M0 35H600M0 80H600M0 125H600M0 170H600"
                />
                <path
                  className="line lost-line"
                  d="M0 140 C60 130 80 88 130 100 S220 55 280 85 S360 30 420 60 S510 20 600 35"
                />
                <path
                  className="line found-line"
                  d="M0 155 C70 145 90 120 140 130 S230 90 290 110 S390 75 440 90 S520 55 600 70"
                />
                <path
                  className="line return-line"
                  d="M0 165 C80 155 100 145 160 150 S260 120 320 130 S410 100 470 110 S540 80 600 88"
                />
              </svg>
              <div className="axis">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </div>
          </Card>
          <Card className="chart-card">
            <div className="chart-head">
              <div>
                <strong>Lost vs Found</strong>
                <span>Current semester</span>
              </div>
            </div>
            <div className="donut">
              <div>
                <strong>124</strong>
                <span>Total items</span>
              </div>
            </div>
            <div className="donut-stats">
              <span>
                <i className="blue-dot" />
                Lost <strong>78</strong>
              </span>
              <span>
                <i className="green-dot" />
                Found <strong>46</strong>
              </span>
            </div>
          </Card>
        </div>
        <div className="admin-bottom-grid">
          <Card className="chart-card">
            <div className="chart-head">
              <div>
                <strong>Reports by location</strong>
                <span>Top campus areas</span>
              </div>
              <div className="text-action" onClick={() => go("analytics")}>
                View analytics
              </div>
            </div>
            <div className="bar-list">
              {[
                ["Library", 82],
                ["Canteen", 68],
                ["Academic Block", 55],
                ["Parking", 39],
                ["Sports Area", 25],
              ].map(([label, amount]) => (
                <div className="bar-row" key={label}>
                  <span>{label}</span>
                  <div>
                    <i style={{ width: `${amount}%` }} />
                  </div>
                  <strong>{Math.round(Number(amount) / 4)}</strong>
                </div>
              ))}
            </div>
          </Card>
          <Card className="activity-card">
            <div className="chart-head">
              <div>
                <strong>Needs attention</strong>
                <span>Priority admin tasks</span>
              </div>
            </div>
            {[
              ["Claim waiting 26 hours", "White AirPods Pro", "warning"],
              ["Handover today, 1:30 PM", "Rahul Kumar", "pin"],
              ["Listing reported by user", "Black Smartphone", "shield"],
            ].map(([title, copy, icon]) => (
              <div className="activity-row" key={title}>
                <div>
                  <Icon name={icon as IconName} />
                </div>
                <span>
                  <strong>{title}</strong>
                  {copy}
                </span>
                <Icon name="chevron" size="sm" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

const tableRows = [
  [
    "Black Smartphone",
    "Lost",
    "Electronics",
    "Library",
    "Rahul",
    "02 Oct",
    "Matching",
  ],
  [
    "Black Backpack",
    "Found",
    "Bags",
    "Academic Block",
    "Aman",
    "02 Oct",
    "Claimed",
  ],
  ["Keychain", "Found", "Keys", "Canteen", "Priya", "01 Oct", "Pending"],
  [
    "College ID Card",
    "Found",
    "ID Cards",
    "Main Block",
    "Staff",
    "01 Oct",
    "Approved",
  ],
  [
    "Casio Calculator",
    "Lost",
    "Electronics",
    "Lab 3",
    "Sneha",
    "30 Sep",
    "Searching",
  ],
]

function AdminItems({ go }: { go: (s: Screen) => void }) {
  const [activeActions, setActiveActions] = useState<number | null>(null)
  const [closeDialog, setCloseDialog] = useState(false)
  return (
    <AdminLayout
      current="admin-items"
      go={go}
      title="Item Management"
      subtitle="Review and manage all campus reports"
    >
      <div className="admin-content">
        <div className="table-tools">
          <div className="search-wide">
            <Icon name="search" />
            Search items, users or report IDs
          </div>
          <div className="filter-button">
            <Icon name="settings" /> Filters
          </div>
          <Button wide={false}>+ ADD ITEM</Button>
        </div>
        <div className="admin-tabs">
          <span className="active">
            All Items <b>124</b>
          </span>
          <span>
            Lost <b>78</b>
          </span>
          <span>
            Found <b>46</b>
          </span>
          <span>
            Needs Review <b>12</b>
          </span>
        </div>
        <Card className="data-table">
          <div className="table-row table-header">
            {[
              "Item",
              "Type",
              "Category",
              "Location",
              "Reported By",
              "Date",
              "Status",
              "Actions",
            ].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {tableRows.map((row, index) => (
            <div className="table-row" key={row[0]}>
              <div className="table-item">
                <ItemVisual
                  kind={
                    index === 0 ? "phone" : index === 1 ? "backpack" : "keys"
                  }
                />
                <strong>{row[0]}</strong>
              </div>
              <span>
                <Badge tone={row[1] === "Lost" ? "red" : "green"}>
                  {row[1].toUpperCase()}
                </Badge>
              </span>
              <span>{row[2]}</span>
              <span>{row[3]}</span>
              <span>{row[4]}</span>
              <span>{row[5]}</span>
              <span>
                <Badge
                  tone={
                    row[6] === "Pending"
                      ? "orange"
                      : row[6] === "Claimed" || row[6] === "Matching"
                        ? "blue"
                        : "green"
                  }
                >
                  {row[6].toUpperCase()}
                </Badge>
              </span>
              <div className="row-actions">
                <div
                  className="view-action"
                  role="button"
                  onClick={() => go("admin-claim")}
                >
                  View
                </div>
                <div
                  className="more-action"
                  role="button"
                  onClick={() =>
                    setActiveActions(activeActions === index ? null : index)
                  }
                >
                  •••
                </div>
                {activeActions === index && (
                  <div className="row-action-menu">
                    <div role="button" onClick={() => go("admin-claim")}>
                      <Icon name="check" size="sm" /> Approve
                    </div>
                    <div role="button">
                      <Icon name="message" size="sm" /> Contact User
                    </div>
                    <div
                      role="button"
                      className="danger"
                      onClick={() => setCloseDialog(true)}
                    >
                      <Icon name="close" size="sm" /> Close Report
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="table-footer">
            <span>Showing 1–5 of 124 items</span>
            <div>
              <span>Previous</span>
              <b>1</b>
              <span>2</span>
              <span>3</span>
              <span>Next</span>
            </div>
          </div>
        </Card>
      </div>
      {closeDialog && (
        <Modal
          icon="warning"
          title="Close this report?"
          copy="This removes the report from active matching. The action is recorded and can be reviewed by an administrator."
          action="CLOSE REPORT"
          destructive
          onClose={() => setCloseDialog(false)}
          onAction={() => {
            setCloseDialog(false)
            setActiveActions(null)
          }}
        />
      )}
    </AdminLayout>
  )
}

function AdminClaim({ go }: { go: (s: Screen) => void }) {
  const [checks, setChecks] = useState([true, true, false, true, false])
  const [rejectDialog, setRejectDialog] = useState(false)
  const labels = [
    "Student identity verified",
    "Item description matches",
    "Ownership evidence provided",
    "Finder information verified",
    "Handover location confirmed",
  ]
  return (
    <AdminLayout
      current="admin-claim"
      go={go}
      title="Claim Review"
      subtitle="Claim #CL-2026-00042 • Submitted 02 Oct 2026"
    >
      <div className="admin-content">
        <div className="claim-review-grid">
          <div className="review-column">
            <Card className="admin-item-summary">
              <ItemVisual kind="airpods" large />
              <div>
                <Badge tone="green">FOUND</Badge>
                <div className="admin-card-title">White AirPods Pro</div>
                <span>Item #FD-2026-00487</span>
                <div className="mini-details">
                  <div>
                    <span>Found at</span>
                    <strong>Canteen</strong>
                  </div>
                  <div>
                    <span>Found on</span>
                    <strong>02 Oct, 1:40 PM</strong>
                  </div>
                  <div>
                    <span>Currently</span>
                    <strong>L&amp;F Desk</strong>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="evidence-card">
              <SectionTitle title="REPORTED DESCRIPTION" />
              <p>
                White Apple AirPods Pro found near the canteen west entrance.
              </p>
              <SectionTitle title="PRIVATE OWNERSHIP DETAILS" />
              <div className="private-evidence">
                <Icon name="lock" />
                <p>
                  Small scratch underneath the charging case. Left earbud has a
                  faint blue ink mark.
                </p>
              </div>
              <SectionTitle title="CLAIM ANSWERS" />
              <div className="answer-row">
                <span>Identifying feature</span>
                <strong>Small scratch underneath the case</strong>
              </div>
              <div className="answer-row">
                <span>Approximate time lost</span>
                <strong>1:15 PM</strong>
              </div>
              <div className="answer-row">
                <span>Last seen</span>
                <strong>Near the west-side juice counter</strong>
              </div>
              <SectionTitle title="UPLOADED PROOF" />
              <div className="proof-card">
                <Icon name="file" />
                <span>
                  <strong>AirPods_purchase_receipt.pdf</strong>PDF • 284 KB
                </span>
                <div className="text-action">View</div>
              </div>
            </Card>
          </div>
          <div className="review-column">
            <Card className="claimant-card">
              <div className="section-title">
                <span>CLAIMANT</span>
                <Badge tone="green">KSIT VERIFIED</Badge>
              </div>
              <div className="claimant-profile">
                <div className="avatar large">RK</div>
                <div>
                  <div className="admin-card-title">Rahul Kumar</div>
                  <span>1KS23CS001</span>
                  <p>Computer Science &amp; Engineering • 7th Semester</p>
                </div>
              </div>
            </Card>
            <Card className="verification-card">
              <div className="admin-card-title">Verification checklist</div>
              <p>Complete all checks before making a decision.</p>
              {labels.map((label, index) => (
                <div
                  className="check-row"
                  role="button"
                  onClick={() =>
                    setChecks(
                      checks.map((item, i) => (i === index ? !item : item)),
                    )
                  }
                  key={label}
                >
                  <span
                    className={`checkbox ${checks[index] ? "checked" : ""}`}
                  >
                    {checks[index] && <Icon name="check" size="sm" />}
                  </span>
                  {label}
                </div>
              ))}
              <div className="decision-actions">
                <Button onClick={() => go("admin-handover")}>
                  APPROVE CLAIM
                </Button>
                <Button variant="danger" onClick={() => setRejectDialog(true)}>
                  REJECT CLAIM
                </Button>
              </div>
            </Card>
            <Card className="finder-card">
              <div className="section-title">
                <span>FINDER INFORMATION</span>
                <Badge tone="green">VERIFIED</Badge>
              </div>
              <div className="claimant-profile small">
                <div className="avatar">AP</div>
                <div>
                  <strong>Aman Prakash</strong>
                  <span>1KS22EC014 • ECE</span>
                </div>
              </div>
              <Button variant="secondary" icon="message">
                CONTACT FINDER
              </Button>
            </Card>
          </div>
        </div>
      </div>
      {rejectDialog && (
        <Modal
          icon="warning"
          title="Reject this ownership claim?"
          copy="The claimant will be notified and asked to contact the Lost & Found Desk if they need clarification."
          action="REJECT CLAIM"
          destructive
          onClose={() => setRejectDialog(false)}
          onAction={() => setRejectDialog(false)}
        />
      )}
    </AdminLayout>
  )
}

function AdminHandover({ go }: { go: (s: Screen) => void }) {
  const [complete, setComplete] = useState(false)
  return (
    <AdminLayout
      current="admin-handover"
      go={go}
      title="Pending Handovers"
      subtitle="Coordinate and verify secure item collections"
    >
      <div className="admin-content">
        <div className="handover-metrics">
          <Card>
            <strong>8</strong>
            <span>Scheduled today</span>
          </Card>
          <Card>
            <strong>3</strong>
            <span>Waiting now</span>
          </Card>
          <Card>
            <strong>41</strong>
            <span>Completed this month</span>
          </Card>
        </div>
        <div className="handover-admin-grid">
          <Card className="handover-admin-card">
            <div className="handover-time">
              <strong>1:30</strong>
              <span>
                PM
                <br />
                TODAY
              </span>
            </div>
            <ItemVisual kind="airpods" />
            <div className="handover-admin-copy">
              <Badge tone={complete ? "green" : "blue"}>
                {complete ? "COMPLETED" : "READY FOR COLLECTION"}
              </Badge>
              <div className="admin-card-title">White AirPods Pro</div>
              <span>
                Owner: <strong>Rahul Kumar</strong> • 1KS23CS001
              </span>
              <span>
                <Icon name="pin" size="sm" /> KSIT Lost &amp; Found Desk
              </span>
            </div>
            <div className="code-block">
              <span>HANDOVER CODE</span>
              <strong>739281</strong>
            </div>
            <Button wide={false} onClick={() => setComplete(true)}>
              {complete ? "HANDOVER COMPLETED ✓" : "VERIFY HANDOVER"}
            </Button>
          </Card>
          <Card className="handover-admin-card">
            <div className="handover-time">
              <strong>3:00</strong>
              <span>
                PM
                <br />
                TODAY
              </span>
            </div>
            <ItemVisual kind="backpack" />
            <div className="handover-admin-copy">
              <Badge tone="blue">READY FOR COLLECTION</Badge>
              <div className="admin-card-title">Black Backpack</div>
              <span>
                Owner: <strong>Sneha Rao</strong> • 1KS24IS022
              </span>
              <span>
                <Icon name="pin" size="sm" /> Security Office
              </span>
            </div>
            <div className="code-block">
              <span>HANDOVER CODE</span>
              <strong>104582</strong>
            </div>
            <Button wide={false}>VERIFY HANDOVER</Button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

function Analytics({ go }: { go: (s: Screen) => void }) {
  const categories = [
    ["ID Cards", 84],
    ["Electronics", 72],
    ["Books", 58],
    ["Bags", 45],
    ["Keys", 38],
    ["Chargers", 28],
  ]
  return (
    <AdminLayout
      current="analytics"
      go={go}
      title="Campus Lost & Found Analytics"
      subtitle="Administrative insights • Current semester"
    >
      <div className="admin-content">
        <div className="analytics-head">
          <div className="privacy-inline">
            <Icon name="shield" size="sm" />
            For administrative planning only
          </div>
          <div className="filter-button">
            <Icon name="calendar" /> Current semester
          </div>
        </div>
        <div className="analytics-grid">
          <Card className="chart-card">
            <div className="chart-head">
              <div>
                <strong>Most Reported Categories</strong>
                <span>By total number of reports</span>
              </div>
            </div>
            <div className="category-bars">
              {categories.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <div>
                    <i style={{ width: `${value}%` }} />
                  </div>
                  <strong>{Math.round(Number(value) / 3)}</strong>
                </div>
              ))}
            </div>
          </Card>
          <Card className="chart-card">
            <div className="chart-head">
              <div>
                <strong>Most Common Locations</strong>
                <span>Campus hotspots by reports</span>
              </div>
            </div>
            <div className="location-list">
              {[
                "Library",
                "Canteen",
                "Academic Block",
                "Parking",
                "Classrooms",
                "Sports Area",
              ].map((location, index) => (
                <div key={location}>
                  <span>{index + 1}</span>
                  <strong>{location}</strong>
                  <div>
                    <i style={{ width: `${92 - index * 12}%` }} />
                  </div>
                  <b>{26 - index * 3}</b>
                </div>
              ))}
            </div>
          </Card>
          <Card className="campus-map">
            <div className="chart-head">
              <div>
                <strong>Campus Report Heatmap</strong>
                <span>Darker areas indicate more lost and found reports</span>
              </div>
              <div className="heat-legend">
                LOW <i />
                <i />
                <i /> HIGH
              </div>
            </div>
            <div className="map-canvas">
              <div className="map-road horizontal" />
              <div className="map-road vertical" />
              <div className="building main">
                MAIN BLOCK<span className="heat heat-high">24</span>
              </div>
              <div className="building library">
                LIBRARY<span className="heat heat-hot">29</span>
              </div>
              <div className="building canteen">
                CANTEEN<span className="heat heat-hot">22</span>
              </div>
              <div className="building academic">
                ACADEMIC BLOCK<span className="heat heat-medium">18</span>
              </div>
              <div className="building parking">
                PARKING<span className="heat heat-low">9</span>
              </div>
              <div className="building sports">
                SPORTS AREA<span className="heat heat-low">6</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

const screenLabels: Array<[Screen, string]> = [
  ["splash", "01 Splash"],
  ["login", "02 Login"],
  ["home", "03 Home"],
  ["search", "04 Search"],
  ["lost-item", "05 Report lost"],
  ["lost-details", "06 Lost details"],
  ["review", "07 Review"],
  ["success", "08 Success"],
  ["found", "09 Report found"],
  ["item", "10 Item details"],
  ["match", "11 Smart match"],
  ["verify", "12 Verify ownership"],
  ["claim", "13 Claim status"],
  ["chat", "14 Secure chat"],
  ["handover", "15 Handover"],
  ["returned", "16 Return success"],
  ["reports", "17 My reports"],
  ["notifications", "18 Notifications"],
  ["profile", "19 Profile"],
  ["admin", "20 Admin dashboard"],
  ["admin-items", "21 Admin items"],
  ["admin-claim", "22 Claim review"],
  ["admin-handover", "23 Handovers"],
  ["analytics", "24 Analytics"],
  ["privacy", "25 Privacy"],
]

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [navigatorOpen, setNavigatorOpen] = useState(false)
  const [reportKind, setReportKind] = useState<"lost" | "found">("lost")
  const [feedbackState, setFeedbackState] =
    useState<"loading" | "error" | "empty" | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setNavigatorOpen(false)
  }, [screen])

  const go = (next: Screen) => setScreen(next)
  const screens: Record<Screen, ReactNode> = {
    splash: <Splash go={go} />,
    login: <Login go={go} />,
    home: <Home go={go} />,
    search: <SearchScreen go={go} />,
    "lost-item": <ReportLostItem go={go} />,
    "lost-details": <LostDetails go={go} />,
    review: (
      <Review
        go={go}
        onSubmit={() => {
          setReportKind("lost")
          go("success")
        }}
      />
    ),
    success: <Success go={go} kind={reportKind} />,
    found: (
      <FoundForm
        go={go}
        onSubmit={() => {
          setReportKind("found")
          go("success")
        }}
      />
    ),
    item: <ItemDetails go={go} />,
    match: <Match go={go} />,
    verify: <Verify go={go} />,
    claim: <ClaimStatus go={go} />,
    chat: <Chat go={go} />,
    handover: <Handover go={go} />,
    returned: <Returned go={go} />,
    reports: <Reports go={go} />,
    notifications: <Notifications go={go} />,
    profile: <Profile go={go} />,
    privacy: <Privacy go={go} />,
    admin: <AdminDashboard go={go} />,
    "admin-items": <AdminItems go={go} />,
    "admin-claim": <AdminClaim go={go} />,
    "admin-handover": <AdminHandover go={go} />,
    analytics: <Analytics go={go} />,
  }

  return (
    <div className="app-root">
      {screens[screen]}
      <div
        className="prototype-trigger"
        role="button"
        onClick={() => setNavigatorOpen(!navigatorOpen)}
      >
        <Icon name={navigatorOpen ? "close" : "menu"} />
        <span>Prototype map</span>
      </div>
      {navigatorOpen && (
        <div className="prototype-panel">
          <div className="prototype-panel-head">
            <div>
              <strong>KSIT FIND</strong>
              <span>25 connected screens</span>
            </div>
            <div role="button" onClick={() => setNavigatorOpen(false)}>
              <Icon name="close" />
            </div>
          </div>
          <div className="prototype-list">
            {screenLabels.map(([key, label]) => (
              <div
                role="button"
                className={screen === key ? "active" : ""}
                onClick={() => go(key)}
                key={key}
              >
                <span>{label}</span>
                <Icon name="chevron" size="sm" />
              </div>
            ))}
          </div>
          <div className="prototype-states">
            <span>PREVIEW SYSTEM STATES</span>
            <div>
              {(["loading", "error", "empty"] as const).map((state) => (
                <div
                  role="button"
                  key={state}
                  onClick={() => {
                    setFeedbackState(state)
                    setNavigatorOpen(false)
                  }}
                >
                  {state}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {feedbackState && (
        <FeedbackOverlay
          state={feedbackState}
          onClose={() => setFeedbackState(null)}
        />
      )}
    </div>
  )
}
