import { useEffect, useState, type ReactNode } from "react"
import {
  type ClaimDto,
  type ClaimMessageDto,
  type ItemDto,
  type UserDto,
  clearAuthToken,
  completeHandover,
  createItem,
  getAdminStats,
  getAdminUsers,
  getAuthToken,
  getClaimById,
  getClaimMessages,
  getAdminClaims,
  getAdminItems,
  getCurrentUser,
  getItemById,
  getItems,
  getMyClaims,
  getMyItems,
  markNotificationRead,
  getNotifications,
  getUnreadNotificationCount,
  getUserProfile,
  loginUser,
  markAllNotificationsRead,
  registerUser,
  setAuthToken,
  submitClaim,
  sendClaimMessage,
  updateClaimStatus,
  updateUserProfile,
  setAdminItemStatus,
  updateAdminUserRole,
  resolveMediaUrl,
  uploadImage,
  reportItem,
} from './api'

type Screen = "splash" | "login" | "home" | "search" | "lost-item" | "lost-details" | "review" | "success" | "found" | "item" | "match" | "verify" | "claim" | "chat" | "handover" | "returned" | "reports" | "notifications" | "profile" | "admin" | "admin-items" | "admin-users" | "admin-claim" | "admin-handover" | "analytics" | "privacy"

type ReportDraft = {
  category: string
  itemName: string
  brand: string
  color: string
  location: string
  date: string
  time: string
  description: string
  privateDetails: string
  currentLocation: string
  imageUrls: string[]
}

const emptyReportDraft: ReportDraft = {
  category: '',
  itemName: '',
  brand: '',
  color: '',
  location: '',
  date: '',
  time: '',
  description: '',
  privateDetails: '',
  currentLocation: '',
  imageUrls: [],
}

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
  content,
}: {
  icon: IconName
  title: string
  copy: string
  action: string
  onAction: () => void
  onClose: () => void
  destructive?: boolean
  content?: ReactNode
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
        {content}
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
  onChange,
  type = "text",
  editable = false,
}: {
  label: string
  value?: string
  placeholder?: string
  icon?: IconName
  multiline?: boolean
  privateField?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string
  editable?: boolean
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
        {editable ? (
          multiline ? (
            <textarea
              value={value ?? ""}
              placeholder={placeholder}
              onChange={onChange}
              rows={4}
              className="field-input field-textarea"
            />
          ) : (
            <input
              type={type}
              value={value ?? ""}
              placeholder={placeholder}
              onChange={onChange}
              className="field-input"
            />
          )
        ) : (
          <>
            <span className={value ? "" : "placeholder"}>
              {value || placeholder}
            </span>
            {!multiline && !icon && <Icon name="chevron" size="sm" />}
          </>
        )}
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

const navItems: Array<{ key: Screen; label: string; icon: IconName }> = [
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

function StatusTimeline({ status }: { status: ClaimDto['status'] }) {
  const stages = [
    { label: 'Claim submitted', state: 'complete' },
    status === 'REJECTED'
      ? { label: 'Claim rejected', state: 'current' }
      : status === 'CANCELLED'
        ? { label: 'Claim cancelled', state: 'current' }
        : { label: 'Under review', state: status === 'PENDING' ? 'current' : 'complete' },
    ...(status === 'APPROVED' ? [{ label: 'Handover pending', state: 'current' }] : []),
  ]
  return (
    <div className="timeline">
      {stages.map(({ label, state }) => {
        const complete = state === 'complete'
        const current = state === 'current'
        return (
        <div
          className={`timeline-row ${
            complete ? "complete" : current ? "current" : ""
          }`}
          key={label}
        >
          <div className="timeline-marker">
            {complete ? <Icon name="check" size="sm" /> : ""}
          </div>
          <div>
            <div className="timeline-label">{label}</div>
            <div className="timeline-meta">
              {complete
                ? "Completed"
                : current && status !== 'REJECTED' && status !== 'CANCELLED'
                  ? "In progress"
                  : status === 'REJECTED' || status === 'CANCELLED'
                    ? status
                    : "Pending"}
            </div>
          </div>
        </div>
      )})}
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
  imageUrl,
}: {
  kind?: string
  large?: boolean
  imageUrl?: string
}) {
  return (
    <div
      className={`item-visual ${large ? "item-visual-large" : ""}`}
      style={{ background: itemImages[kind] }}
    >
      {imageUrl ? (
        <img className="item-photo" src={resolveMediaUrl(imageUrl)} alt={kind} />
      ) : (
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
      )}
    </div>
  )
}

function ImageUploadField({ value, onUploaded }: { value?: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const response = await uploadImage(file)
      onUploaded(response.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload this image.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <>
      <label className="photo-drop photo-upload">
        <input className="upload-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleChange} disabled={uploading} />
        {value ? <img className="upload-preview" src={resolveMediaUrl(value)} alt="Uploaded item" /> : <Icon name="camera" size="lg" />}
        <strong>{uploading ? 'Uploading photo...' : value ? 'Change photo' : '+ Add Photo'}</strong>
        <span>{error || 'JPEG, PNG, WebP or GIF • max 10 MB'}</span>
      </label>
    </>
  )
}

function ItemCard({
  kind,
  name,
  location,
  date,
  imageUrl,
  status = "FOUND",
  tone = "green",
  onClick,
}: {
  kind: string
  name: string
  location: string
  date: string
  imageUrl?: string
  status?: string
  tone?: "red" | "green" | "orange" | "blue" | "gray"
  onClick?: () => void
}) {
  return (
    <Card className="item-card" onClick={onClick}>
      <ItemVisual kind={kind} imageUrl={imageUrl} />
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [registering, setRegistering] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (submitting) return
    setSubmitting(true)
    setError("")
    try {
      const result = registering
        ? await registerUser({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim() || undefined,
          })
        : await loginUser(email.trim(), password)
      setAuthToken(result.token)
      go("home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

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
        <div className="eyebrow">{registering ? "JOIN KSIT FIND" : "WELCOME BACK"}</div>
        <div className="page-title">{registering ? "Create your account" : "Welcome to KSIT FIND"}</div>
        <p className="page-subtitle">
          {registering ? "Register with your KSIT account to get started." : "Sign in with your KSIT account to continue."}
        </p>
        <div className="form-stack">
          {registering && (
            <>
              <Field label="Full name" value={name} placeholder="Your name" editable onChange={(event) => setName(event.target.value)} />
              <Field label="Phone (optional)" value={phone} placeholder="Phone number" editable onChange={(event) => setPhone(event.target.value)} />
            </>
          )}
          <Field
            label="College Email"
            value={email}
            placeholder="you@ksit.edu.in"
            editable
            onChange={(event) => setEmail(event.target.value)}
          />
          <Field
            label="Password"
            value={password}
            placeholder="Enter password"
            type="password"
            editable
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <div className="form-error">{error}</div>}
          {!registering && <div className="form-link">Forgot Password?</div>}
          <Button onClick={handleLogin}>{submitting ? "PLEASE WAIT..." : registering ? "CREATE ACCOUNT" : "LOGIN"}</Button>
          <div className="form-link" role="button" onClick={() => { setRegistering(!registering); setError("") }}>
            {registering ? "Already registered? Sign in" : "New to KSIT FIND? Create an account"}
          </div>
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

function Home({ go, onSelectItem }: { go: (s: Screen) => void; onSelectItem: (id: string) => void }) {
  const [items, setItems] = useState<ItemDto[]>([])
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('there')
  const [notificationCount, setNotificationCount] = useState<number>(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true)
      setError('')
      try {
        const [user, itemResponse, unread] = await Promise.all([
          getUserProfile(),
          getItems({ page: 0, size: 5 }),
          getUnreadNotificationCount(),
        ])
        setUserName(user.name.split(' ')[0] || 'there')
        setItems(itemResponse.content ?? [])
        setNotificationCount(unread)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the home feed.')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [])

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
              {notificationCount > 0 && <span />}
            </div>
            <div className="avatar" role="button" onClick={() => go("profile")}>
              {userName.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="greeting">
          <div className="eyebrow">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase()}</div>
          <div className="page-title">
            Welcome, {userName} <span aria-label="wave">👋</span>
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
        <SectionTitle
          title="RECENTLY REPORTED"
          action="View all"
          onAction={() => go("search")}
        />
        {error && <div className="form-error">{error}</div>}
        <div className="item-list">
          {loading ? <div className="loading-lines"><span /><span /><span /></div> : items.length === 0 ? (
            <Card className="empty-state">
              <strong>No reports yet</strong>
              <span>New campus lost and found reports will appear here.</span>
            </Card>
          ) : items.map((item, index) => (
            <ItemCard
              key={item.id}
              kind={index % 3 === 0 ? 'phone' : index % 3 === 1 ? 'backpack' : 'keys'}
              name={item.title}
              location={item.location}
              date={item.itemDate ? new Date(item.itemDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'}) : 'Today'}
              imageUrl={item.imageUrls?.[0]}
              status={item.itemType}
              tone={item.itemType === 'LOST' ? 'red' : 'green'}
              onClick={() => onSelectItem(item.id)}
            />
          ))}
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

function SearchScreen({ go, onSelectItem }: { go: (s: Screen) => void; onSelectItem: (id: string) => void }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<ItemDto[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [itemType, setItemType] = useState('')
  const [category, setCategory] = useState('')
  const [draftFilters, setDraftFilters] = useState({ category: '', location: '', status: '', dateFrom: '' })
  const [filters, setFilters] = useState(draftFilters)
  const [sortBy, setSortBy] = useState('createdAt')
  const chips = ['All', 'Lost', 'Found', 'Electronics', 'Bags', 'ID Cards', 'Books', 'Keys', 'Other']

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getItems({
          keyword: query,
          type: itemType || undefined,
          category: category || undefined,
          location: filters.location || undefined,
          status: filters.status || undefined,
          dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00` : undefined,
          sortBy,
          direction: 'DESC',
          page: 0,
          size: 12,
        })
        if (active) {
          setItems(response.content ?? [])
          setTotalResults(response.totalElements ?? response.content?.length ?? 0)
        }
      } catch (loadError) {
        if (active) {
          setItems([])
          setTotalResults(0)
          setError(loadError instanceof Error ? loadError.message : 'Unable to search items.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    const timeout = window.setTimeout(() => {
      void load()
    }, 300)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [query, itemType, category, filters, sortBy])

  const primaryItem = items[0]
  const selectChip = (chip: string) => {
    if (chip === 'All') {
      setItemType('')
      setCategory('')
    } else if (chip === 'Lost' || chip === 'Found') {
      setItemType(chip.toUpperCase())
      setCategory('')
    } else {
      setItemType('')
      setCategory(chip)
    }
  }
  const selectedChip = itemType === 'LOST' ? 'Lost' : itemType === 'FOUND' ? 'Found' : category || 'All'

  return (
    <MobilePage current="search" go={go}>
      <div className="sticky-head">
        <TopBar title="Search Lost & Found" />
        <div className="search-box active">
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you looking for?"
            style={{
              border: 'none',
              background: 'transparent',
              flex: 1,
              color: 'inherit',
              font: 'inherit',
              outline: 'none',
            }}
          />
          <div
            className="filter-icon"
            role="button"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Icon name="settings" size="sm" />
          </div>
        </div>
        <div className="chips">
          {chips.map((chip) => (
            <div
              className={`chip ${selectedChip === chip ? 'selected' : ''}`}
              key={chip}
              role="button"
              onClick={() => selectChip(chip)}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
      <div className="mobile-content">
        <div className="result-heading">
          <span>{loading ? 'Loading…' : `${totalResults} results`}</span>
          <label>
            <span className="sr-only">Sort results</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="createdAt">Most recent</option>
              <option value="itemDate">Item date</option>
              <option value="title">Title</option>
            </select>
          </label>
        </div>
        {filterOpen && (
          <Card className="filter-panel">
            <div className="filter-title">Advanced filters</div>
            <div className="filter-grid">
              <Field label="Category" value={draftFilters.category} placeholder="Any category" editable onChange={(event) => setDraftFilters({ ...draftFilters, category: event.target.value })} />
              <Field label="Location" value={draftFilters.location} placeholder="Any location" editable onChange={(event) => setDraftFilters({ ...draftFilters, location: event.target.value })} />
              <Field label="Date from" value={draftFilters.dateFrom} type="date" editable onChange={(event) => setDraftFilters({ ...draftFilters, dateFrom: event.target.value })} />
              <Field label="Status" value={draftFilters.status} placeholder="LOST, FOUND, CLAIMED, RESOLVED" editable onChange={(event) => setDraftFilters({ ...draftFilters, status: event.target.value.toUpperCase() })} />
            </div>
            <Button onClick={() => { setFilters(draftFilters); setCategory(draftFilters.category); setFilterOpen(false) }}>APPLY FILTERS</Button>
          </Card>
        )}
        {primaryItem && (
          <Card className="result-featured" onClick={() => onSelectItem(primaryItem.id)}>
            <ItemVisual kind="airpods" large imageUrl={primaryItem.imageUrls?.[0]} />
            <div className="result-content">
              <div className="item-row">
                <Badge tone={primaryItem.itemType === 'LOST' ? 'red' : 'green'}>{primaryItem.itemType}</Badge>
                <Badge tone="blue">Top result</Badge>
              </div>
              <div className="result-title">{primaryItem.title}</div>
              <div className="item-meta vertical">
                <span>
                  <Icon name="pin" size="sm" />
                  {primaryItem.location}
                </span>
                <span>
                  <Icon name="calendar" size="sm" />
                  {primaryItem.itemDate ? new Date(primaryItem.itemDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
                </span>
              </div>
              <Button wide={false} onClick={() => onSelectItem(primaryItem.id)}>
                VIEW DETAILS
              </Button>
            </div>
          </Card>
        )}
        <div className="item-list">
          {loading ? (
            <div className="loading-lines"><span /><span /><span /></div>
          ) : error ? (
            <div className="form-error">{error}</div>
          ) : items.length === 0 ? (
            <Card className="empty-state"><strong>No matching items</strong><span>Try changing your search or filters.</span></Card>
          ) : items.slice(1, 9).map((item, index) => (
            <ItemCard
              key={item.id ?? index}
              kind={index % 3 === 0 ? 'phone' : index % 3 === 1 ? 'backpack' : 'keys'}
              name={item.title}
              location={item.location}
              date={item.itemDate ? new Date(item.itemDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
              imageUrl={item.imageUrls?.[0]}
              status={item.itemType}
              tone={item.itemType === 'LOST' ? 'red' : 'green'}
              onClick={() => onSelectItem(item.id)}
            />
          ))}
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

function ReportLostItem({
  go,
  draft,
  setDraft,
}: {
  go: (s: Screen) => void
  draft: ReportDraft
  setDraft: (draft: ReportDraft) => void
}) {
  return (
    <FormShell title="Report Lost Item" step={1} go={go}>
      <div className="form-heading">What did you lose?</div>
      <p className="form-description">
        Start with the basics. You can finish this report in under a minute.
      </p>
      <div className="form-stack">
        <Field
          label="Category"
          value={draft.category}
          editable
          onChange={(event) => setDraft({ ...draft, category: event.target.value })}
        />
        <Field
          label="Item name"
          value={draft.itemName}
          editable
          onChange={(event) => setDraft({ ...draft, itemName: event.target.value })}
        />
        <div className="field-row">
          <Field
            label="Brand"
            value={draft.brand}
            editable
            onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
          />
          <Field
            label="Color"
            value={draft.color}
            editable
            onChange={(event) => setDraft({ ...draft, color: event.target.value })}
          />
        </div>
        <div className="field-label">
          Add image <span className="optional">Optional</span>
        </div>
        <ImageUploadField value={draft.imageUrls[0]} onUploaded={(url) => setDraft({ ...draft, imageUrls: [url] })} />
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

function LostDetails({
  go,
  draft,
  setDraft,
}: {
  go: (s: Screen) => void
  draft: ReportDraft
  setDraft: (draft: ReportDraft) => void
}) {
  return (
    <FormShell title="Lost Item Details" step={2} go={go}>
      <div className="form-heading">When and where?</div>
      <p className="form-description">
        Approximate details are fine. They help narrow down possible matches.
      </p>
      <div className="form-stack">
        <div className="field-row">
          <Field
            label="Date Lost"
            value={draft.date}
            icon="calendar"
            editable
            type="date"
            onChange={(event) => setDraft({ ...draft, date: event.target.value })}
          />
          <Field
            label="Approx. Time"
            value={draft.time}
            icon="clock"
            editable
            type="time"
            onChange={(event) => setDraft({ ...draft, time: event.target.value })}
          />
        </div>
        <Field
          label="Where did you lose it?"
          value={draft.location}
          editable
          onChange={(event) => setDraft({ ...draft, location: event.target.value })}
        />
        <Field
          label="Describe your item"
          value={draft.description}
          multiline
          editable
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
        />
        <Field
          label="Private identifying details"
          value={draft.privateDetails}
          multiline
          privateField
          editable
          onChange={(event) => setDraft({ ...draft, privateDetails: event.target.value })}
        />
        <div className="privacy-tip">
          <Icon name="shield" />
          <span>
            <strong>Kept private</strong> These details are hidden from public
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
  draft,
  submitting,
  error,
}: {
  go: (s: Screen) => void
  onSubmit: () => Promise<void> | void
  draft: ReportDraft
  submitting?: boolean
  error?: string | null
}) {
  const rows = [
    ["Category", draft.category],
    ["Brand", draft.brand || "Not set"],
    ["Color", draft.color],
    ["Location", draft.location],
    ["Date", draft.date || "Not set"],
    ["Time", draft.time || "Not set"],
  ]
  return (
    <FormShell title="Review Your Report" step={4} go={go}>
      <p className="form-description">
        Check the details before submitting. Private information won&apos;t
        appear publicly.
      </p>
      <Card className="review-card">
        <div className="review-top">
          <ItemVisual kind="airpods" imageUrl={draft.imageUrls[0]} />
          <div>
            <Badge tone="red">LOST</Badge>
            <div className="review-name">{draft.itemName || "Item"}</div>
          </div>
        </div>
        <div className="review-rows">
          {rows.map(([label, value]) => (
            <div className="review-row" key={label}>
              <span>{label}</span>
              <strong>{String(value)}</strong>
            </div>
          ))}
        </div>
        <div className="review-description">
          <span>Description</span>
          <p>{draft.description || "No description added."}</p>
        </div>
        <div className="privacy-inline">
          <Icon name="lock" size="sm" /> Private details protected
        </div>
      </Card>
      {error && <div className="form-error">{error}</div>}
      <div className="button-row">
        <Button variant="secondary" onClick={() => go("lost-details")}>
          EDIT
        </Button>
        <Button onClick={onSubmit}>{submitting ? "SUBMITTING..." : "SUBMIT REPORT"}</Button>
      </div>
    </FormShell>
  )
}

function Success({
  go,
  kind,
  itemId,
}: {
  go: (s: Screen) => void
  kind: "lost" | "found"
  itemId: string | null
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
        <strong>{itemId ?? '—'}</strong>
        <div className="copy-icon">
          <Icon name="file" size="sm" />
        </div>
      </Card>
      <div className="center-actions">
        <Button onClick={() => go(itemId ? "item" : "reports")}>VIEW REPORT</Button>
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
  draft,
  setDraft,
  submitting,
  error,
}: {
  go: (s: Screen) => void
  onSubmit: () => Promise<void> | void
  draft: ReportDraft
  setDraft: (draft: ReportDraft) => void
  submitting?: boolean
  error?: string | null
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
          <Field
            label="Category"
            value={draft.category}
            editable
            onChange={(event) => setDraft({ ...draft, category: event.target.value })}
          />
          <Field
            label="Color"
            value={draft.color}
            editable
            onChange={(event) => setDraft({ ...draft, color: event.target.value })}
          />
        </div>
        <Field
          label="Item name"
          value={draft.itemName}
          editable
          onChange={(event) => setDraft({ ...draft, itemName: event.target.value })}
        />
        <Field
          label="Location found"
          value={draft.location}
          editable
          onChange={(event) => setDraft({ ...draft, location: event.target.value })}
        />
        <div className="field-row">
          <Field
            label="Date found"
            value={draft.date}
            icon="calendar"
            editable
            type="date"
            onChange={(event) => setDraft({ ...draft, date: event.target.value })}
          />
          <Field
            label="Time found"
            value={draft.time}
            icon="clock"
            editable
            type="time"
            onChange={(event) => setDraft({ ...draft, time: event.target.value })}
          />
        </div>
        <ImageUploadField value={draft.imageUrls[0]} onUploaded={(url) => setDraft({ ...draft, imageUrls: [url] })} />
        <Field
          label="Description"
          value={draft.description}
          multiline
          editable
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
        />
        <div className="field-label">Where is the item currently?</div>
        <div className="radio-list">
          {[
            "With me",
            "Submitted to Lost & Found Desk",
            "With Security",
            "Other",
          ].map((item, index) => (
            <div className="radio-row" key={item} role="radio" aria-checked={draft.currentLocation === item} onClick={() => setDraft({ ...draft, currentLocation: item })}>
              <span className={`radio ${draft.currentLocation === item ? "selected" : ""}`} />
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
        {error && <div className="form-error">{error}</div>}
        <Button onClick={onSubmit}>{submitting ? "SUBMITTING..." : "SUBMIT FOUND ITEM"}</Button>
      </div>
    </FormShell>
  )
}

function ItemDetails({ go, itemId }: { go: (s: Screen) => void; itemId: string | null }) {
  const [reportDialog, setReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [submittingReport, setSubmittingReport] = useState(false)
  const [reportError, setReportError] = useState('')
  const [reportSuccess, setReportSuccess] = useState('')
  const [item, setItem] = useState<ItemDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!itemId) {
      setItem(null)
      setError('Select a report from the feed or search results first.')
      return
    }
    let active = true
    setLoading(true)
    setError('')
    setItem(null)
    getItemById(itemId)
      .then((data) => {
        if (active) setItem(data)
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load this item.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [itemId])

  const completedLifecycleSteps = item?.status === 'RESOLVED'
    ? 4
    : item?.status === 'CLAIMED'
      ? 2
      : item?.status === 'FOUND'
        ? 1
        : 0

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
        <ItemVisual kind="airpods" large imageUrl={item?.imageUrls?.[0]} />
        {item && <Badge tone={item.itemType === 'LOST' ? 'red' : 'green'}>{item.itemType}</Badge>}
      </div>
      <div className="mobile-content detail-content">
        {loading ? (
          <div className="loading-lines"><span /><span /><span /></div>
        ) : error ? (
          <div className="form-error">{error}</div>
        ) : item ? (
          <>
        <div className="page-title">{item.title}</div>
        <div className="detail-id">ITEM #{item.id}</div>
        <div className="detail-grid">
          <div>
            <span>Category</span>
            <strong>{item.category}</strong>
          </div>
          {item.brand && <div><span>Brand</span><strong>{item.brand}</strong></div>}
          {item.color && <div><span>Color</span><strong>{item.color}</strong></div>}
          <div>
            <span>{item.itemType === 'FOUND' ? 'Found' : 'Lost'}</span>
            <strong>{item.itemDate ? new Date(item.itemDate).toLocaleDateString() : 'Date not specified'}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{item.location}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{item.custodyLocation || item.status}</strong>
          </div>
        </div>
        <SectionTitle title="DESCRIPTION" />
        <p className="detail-description">
          {item.description}
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
          {["Reported", "Found and secured", "Ownership claim", "Returned"].map(
            (label, index) => (
              <div
                className={`lifecycle-step ${index < completedLifecycleSteps ? "complete" : ""} ${
                  item.status !== 'RESOLVED' && index === completedLifecycleSteps ? "current" : ""
                }`}
                key={label}
              >
                <span>
                  {index < completedLifecycleSteps ? <Icon name="check" size="sm" /> : index + 1}
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
          {item.itemType === 'FOUND' && item.status === 'FOUND'
            ? <Button onClick={() => go("verify")}>CLAIM THIS ITEM</Button>
            : item.itemType === 'LOST' && <Button onClick={() => go("match")}>FIND POSSIBLE MATCHES</Button>}
          <Button variant="ghost" onClick={() => setReportDialog(true)}>
            REPORT LISTING
          </Button>
          {reportSuccess && <div className="success-message">{reportSuccess}</div>}
        </Card>
          </>
        ) : null}
      </div>
      {reportDialog && item && (
        <Modal
          icon="warning"
          title="Report this listing?"
          copy="Describe why this listing needs review. The reason will be shared with authorized administrators."
          action={submittingReport ? 'SUBMITTING...' : 'SUBMIT REPORT'}
          destructive
          onClose={() => { setReportDialog(false); setReportError('') }}
          onAction={() => {
            if (!reportReason.trim()) {
              setReportError('Add a reason so administrators can review this listing.')
              return
            }
            setSubmittingReport(true)
            setReportError('')
            void reportItem(item.id, reportReason.trim())
              .then(() => {
                setReportDialog(false)
                setReportReason('')
                setReportSuccess('Your report was sent to the KSIT administrators.')
              })
              .catch((submitError) => {
                setReportError(submitError instanceof Error ? submitError.message : 'Unable to submit this listing report.')
              })
              .finally(() => setSubmittingReport(false))
          }}
          content={
            <div className="form-stack">
              <label className="field-label" htmlFor="listing-report-reason">Reason</label>
              <textarea
                id="listing-report-reason"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                maxLength={1000}
                rows={3}
                disabled={submittingReport}
                className="report-reason"
              />
              {reportError && <div className="form-error">{reportError}</div>}
            </div>
          }
        />
      )}
    </MobilePage>
  )
}

function Match({ go, itemId, onSelectItem }: {
  go: (s: Screen) => void
  itemId: string | null
  onSelectItem: (id: string) => void
}) {
  const [lostItem, setLostItem] = useState<ItemDto | null>(null)
  const [matches, setMatches] = useState<ItemDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!itemId) {
      setError('Select one of your lost reports to look for possible matches.')
      return
    }
    let active = true
    setLoading(true)
    setError('')
    const load = async () => {
      try {
        const lost = await getItemById(itemId)
        if (active) setLostItem(lost)
        const found = await getItems({
          type: 'FOUND',
          category: lost.category,
          page: 0,
          size: 20,
          sortBy: 'itemDate',
          direction: 'DESC',
        })
        if (active) setMatches(found.content.filter((item) => item.status === 'FOUND'))
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to find possible matches.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [itemId])

  const match = matches[0]

  return (
    <MobilePage go={go}>
      <TopBar title="SMART MATCH" back={() => go("home")} />
      <div className="mobile-content">
        <div className="match-heading">
          <div className="target-rings">
            <Icon name="target" size="xl" />
          </div>
          <div className="page-title">
            {match ? 'Possible matches found' : 'Search for a match'} <span aria-label="target">🎯</span>
          </div>
          <p>Available found reports in the same category are shown below.</p>
        </div>
        {error && <div className="form-error">{error}</div>}
        {loading ? <div className="loading-lines"><span /><span /><span /></div> : lostItem && match ? (
        <div className="comparison">
          <Card>
            <div className="comparison-label">YOUR LOST ITEM</div>
            <ItemVisual kind="airpods" imageUrl={lostItem.imageUrls?.[0]} />
            <strong>{lostItem.title}</strong>
            <Badge tone="red">LOST</Badge>
          </Card>
          <div className="versus">VS</div>
          <Card onClick={() => onSelectItem(match.id)}>
            <div className="comparison-label">POSSIBLE FOUND ITEM</div>
            <ItemVisual kind="airpods" imageUrl={match.imageUrls?.[0]} />
            <strong>{match.title}</strong>
            <Badge tone="green">FOUND</Badge>
            <span>{match.location}</span>
          </Card>
        </div>
        ) : !error && !loading ? <Card className="empty-state"><strong>No matching found reports</strong><span>Try again later or browse all found items.</span><Button wide={false} onClick={() => go('search')}>SEARCH ITEMS</Button></Card> : null}
        <Card className="match-factors">
          <div className="section-title">
            <span>WHY IT MATCHES</span>
            <Badge tone="blue">POSSIBLE MATCH</Badge>
          </div>
          {[`Same category: ${lostItem?.category ?? '—'}`, 'Review description and location', 'Contact staff to verify private evidence'].map(
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
          <Button onClick={() => match && onSelectItem(match.id)}>VERIFY OWNERSHIP</Button>
          <Button variant="secondary" onClick={() => go("home")}>
            NOT MY ITEM
          </Button>
        </div>
      </div>
    </MobilePage>
  )
}

function Verify({ go, itemId, onSubmitted }: { go: (s: Screen) => void; itemId: string | null; onSubmitted: (id: string) => void }) {
  const [evidence, setEvidence] = useState('')
  const [lastSeenTime, setLastSeenTime] = useState('')
  const [lastSeenLocation, setLastSeenLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!itemId) {
      setError('The item could not be identified. Return to search and select it again.')
      return
    }
    if (!evidence.trim()) {
      setError('Please provide identifying evidence before submitting your claim.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const evidenceDetails = [
        `Identifying feature: ${evidence.trim()}`,
        lastSeenTime.trim() ? `Approximate time lost: ${lastSeenTime.trim()}` : '',
        lastSeenLocation.trim() ? `Last seen location: ${lastSeenLocation.trim()}` : '',
      ].filter(Boolean).join('\n')
      const claim = await submitClaim(itemId, { evidence: evidenceDetails })
      onSubmitted(claim.id)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your claim.')
    } finally {
      setLoading(false)
    }
  }

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
          value={evidence}
          editable
          onChange={(event) => setEvidence(event.target.value)}
        />
        <Field
          label="Approximate time you lost it (optional)"
          value={lastSeenTime}
          icon="clock"
          editable
          type="time"
          onChange={(event) => setLastSeenTime(event.target.value)}
        />
        <Field
          label="Where did you last see it? (optional)"
          value={lastSeenLocation}
          placeholder="Campus area or nearby landmark"
          editable
          onChange={(event) => setLastSeenLocation(event.target.value)}
        />
        <div className="privacy-tip">
          <Icon name="lock" />
          <span>
            Your answers are private to the claim participants and authorized
              staff reviewing ownership.
          </span>
        </div>
        {error && <div className="form-error">{error}</div>}
        <Button onClick={handleSubmit}>{loading ? "SUBMITTING..." : "SUBMIT CLAIM"}</Button>
      </div>
    </FormShell>
  )
}

function ClaimStatus({ go, claimId }: { go: (s: Screen) => void; claimId: string | null }) {
  const [claim, setClaim] = useState<ClaimDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const loadClaim = async () => {
      try {
        const data = claimId
          ? await getClaimById(claimId)
          : (await getMyClaims())[0] ?? null
        if (active) {
          setClaim(data)
          if (!data) setError('You have not submitted a claim yet.')
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load claim status.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadClaim()
    return () => { active = false }
  }, [claimId])

  const cancelClaim = async () => {
    if (!claim) return
    setSaving(true)
    setError('')
    try {
      setClaim(await updateClaimStatus(claim.id, 'CANCELLED'))
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Unable to cancel this claim.')
    } finally {
      setSaving(false)
    }
  }

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
        {loading && <div className="loading-lines"><span /><span /><span /></div>}
        {error && <div className="form-error">{error}</div>}
        {claim && (
          <>
        <Card className="claim-item">
          <ItemVisual kind="airpods" />
          <div>
            <Badge tone={claim.status === 'APPROVED' ? 'green' : claim.status === 'REJECTED' ? 'red' : 'orange'}>{claim.status}</Badge>
            <div className="item-name">{claim.itemTitle}</div>
            <span>Claim #{claim.id}</span>
          </div>
        </Card>
        <Card className="status-card">
          <div className="status-card-head">
            <span>Claim progress</span>
            <span>{claim.status === 'PENDING' ? 'Under review' : claim.status}</span>
          </div>
          <StatusTimeline status={claim.status} />
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
        {claim.status === 'APPROVED' && <Button onClick={() => go('handover')}>VIEW HANDOVER STATUS</Button>}
        {claim.status === 'PENDING' && <Button variant="ghost" onClick={() => void cancelClaim()}>{saving ? 'CANCELLING...' : 'CANCEL CLAIM'}</Button>}
          </>
        )}
      </div>
    </MobilePage>
  )
}

function Chat({ go, claimId }: { go: (s: Screen) => void; claimId: string | null }) {
  const [activeClaim, setActiveClaim] = useState<ClaimDto | null>(null)
  const [messages, setMessages] = useState<ClaimMessageDto[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const load = async () => {
      try {
        const resolvedClaim = claimId
          ? await getClaimById(claimId)
          : (await getMyClaims())[0] ?? null
        if (!resolvedClaim) {
          if (active) setError('A claim is required before you can open a discussion.')
          return
        }
        const data = await getClaimMessages(resolvedClaim.id)
        if (active) {
          setActiveClaim(resolvedClaim)
          setMessages(data)
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load this discussion.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [claimId])

  const send = async () => {
    if (!activeClaim || !draft.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const message = await sendClaimMessage(activeClaim.id, draft.trim())
      setMessages((current) => [...current, message])
      setDraft('')
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send this message.')
    } finally {
      setSending(false)
    }
  }

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
          <strong>{activeClaim?.itemTitle ?? 'Claim discussion'}</strong>
          <span>{activeClaim ? `Claim #${activeClaim.id}` : ''}</span>
        </div>
        {activeClaim && <Badge tone={activeClaim.status === 'PENDING' ? 'orange' : 'blue'}>{activeClaim.status}</Badge>}
      </div>
      <div className="safety-strip">
        <Icon name="shield" size="sm" />
        For your privacy, phone numbers and email addresses are hidden.
      </div>
      <div className="messages">
        {loading && <div className="loading-lines"><span /><span /><span /></div>}
        {error && <div className="form-error">{error}</div>}
        {!loading && !error && messages.length === 0 && <div className="empty-state">No messages yet. Start the discussion.</div>}
        {messages.map((message) => (
          <div className={`bubble ${message.mine ? 'mine' : 'theirs'}`} key={message.id}>
            {message.content}
            <span>{message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          </div>
        ))}
      </div>
      <div className="composer">
        <input className="composer-field" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void send() }} placeholder="Type a message..." maxLength={2000} disabled={!activeClaim || sending} />
        <div className="send-button" role="button" onClick={() => void send()}>
          <Icon name="send" />
        </div>
      </div>
    </MobilePage>
  )
}

function Handover({ go, claimId }: { go: (s: Screen) => void; claimId: string | null }) {
  const [claim, setClaim] = useState<ClaimDto | null>(null)
  const [item, setItem] = useState<ItemDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    const load = async () => {
      try {
        const selectedClaim = claimId ? await getClaimById(claimId) : (await getMyClaims())[0] ?? null
        if (!selectedClaim) {
          if (active) setError('No claim was found for this handover.')
          return
        }
        const selectedItem = await getItemById(selectedClaim.itemId)
        if (active) {
          setClaim(selectedClaim)
          setItem(selectedItem)
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load handover status.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [claimId])

  return (
    <MobilePage go={go}>
      <TopBar title="Item Handover" back={() => go("claim")} />
      <div className="mobile-content">
        {loading && <div className="loading-lines"><span /><span /><span /></div>}
        {error && <div className="form-error">{error}</div>}
        {claim && item && (
          <>
        <div className="handover-status">
          <div className="success-icon small">
            <Icon name={item.status === 'RESOLVED' ? 'check' : 'clock'} />
          </div>
          <div>
            <strong>{item.status === 'RESOLVED' ? 'Handover completed' : 'Claim approved'}</strong>
            <span>{item.status === 'RESOLVED' ? 'The return has been confirmed by staff.' : 'Contact the Lost & Found Desk to arrange collection.'}</span>
          </div>
        </div>
        <Card className="handover-item">
          <ItemVisual kind="airpods" imageUrl={item.imageUrls?.[0]} />
          <div>
            <div className="item-name">{item.title}</div>
            <span>Item #{item.id}</span>
          </div>
          <Badge tone={item.status === 'RESOLVED' ? 'green' : 'blue'}>{item.status}</Badge>
        </Card>
        <Card className="appointment-card">
          <div className="appointment-title">
            <Icon name="pin" />
            KSIT Lost &amp; Found Desk
          </div>
          <p>Bring your student ID and coordinate collection with authorized KSIT staff.</p>
        </Card>
        {item.status === 'RESOLVED' && <Button onClick={() => go('returned')}>VIEW RETURN CONFIRMATION</Button>}
          </>
        )}
      </div>
    </MobilePage>
  )
}

function Returned({ go, claimId }: { go: (s: Screen) => void; claimId: string | null }) {
  const [item, setItem] = useState<ItemDto | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const claim = claimId ? await getClaimById(claimId) : (await getMyClaims())[0] ?? null
        if (!claim) throw new Error('No claim was found for this return.')
        const data = await getItemById(claim.itemId)
        if (active) setItem(data)
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load return status.')
      }
    }
    void load()
    return () => { active = false }
  }, [claimId])

  if (error || !item || item.status !== 'RESOLVED') {
    return (
      <div className="center-screen">
        <div className="center-title">Return not confirmed yet</div>
        <p>{error || 'Authorized staff must confirm the handover before this report is marked returned.'}</p>
        <Button onClick={() => go('handover')}>BACK TO HANDOVER</Button>
      </div>
    )
  }

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
        <ItemVisual kind="airpods" imageUrl={item.imageUrls?.[0]} />
        <div>
          <strong>{item.title}</strong>
          <span>Returned</span>
          <span>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''}</span>
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

function Reports({ go, onSelectItem, onSelectClaim }: {
  go: (s: Screen) => void
  onSelectItem: (id: string) => void
  onSelectClaim: (id: string) => void
}) {
  const [items, setItems] = useState<ItemDto[]>([])
  const [claims, setClaims] = useState<ClaimDto[]>([])
  const [activeTab, setActiveTab] = useState<'LOST' | 'FOUND' | 'CLAIMS'>('LOST')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getMyItems({ page: 0, size: 100 }), getMyClaims()])
      .then(([itemPage, myClaims]) => {
        if (active) {
          setItems(itemPage.content ?? [])
          setClaims(myClaims ?? [])
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load your reports.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const displayedItems = items.filter((item) => item.itemType === activeTab)

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
        <div className={activeTab === 'LOST' ? 'active' : ''} role="button" onClick={() => setActiveTab('LOST')}>
          Lost <span>{items.filter((item) => item.itemType === 'LOST').length}</span>
        </div>
        <div className={activeTab === 'FOUND' ? 'active' : ''} role="button" onClick={() => setActiveTab('FOUND')}>
          Found <span>{items.filter((item) => item.itemType === 'FOUND').length}</span>
        </div>
        <div className={activeTab === 'CLAIMS' ? 'active' : ''} role="button" onClick={() => setActiveTab('CLAIMS')}>
          Claims <span>{claims.length}</span>
        </div>
      </div>
      <div className="mobile-content">
        {error && <div className="form-error">{error}</div>}
        <div className="item-list">
          {loading ? <div className="loading-lines"><span /><span /><span /></div> : activeTab === 'CLAIMS' ? (
            claims.length === 0 ? <Card className="empty-state"><strong>No claims yet</strong><span>Claims you submit will be listed here.</span></Card> :
              claims.map((claim) => (
                <Card className="report-card" key={claim.id} onClick={() => onSelectClaim(claim.id)}>
                  <div className="report-main">
                    <ItemVisual kind="airpods" />
                    <div><div className="item-name">{claim.itemTitle}</div><span>Submitted {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : ''}</span></div>
                    <Badge tone={claim.status === 'APPROVED' ? 'green' : claim.status === 'REJECTED' ? 'red' : 'orange'}>{claim.status}</Badge>
                  </div>
                  <div className="report-foot"><span>Open claim details</span><Icon name="chevron" size="sm" /></div>
                </Card>
              ))
          ) : displayedItems.length === 0 ? (
            <Card className="empty-state"><strong>No {activeTab.toLowerCase()} reports</strong><span>Your reports will appear here after submission.</span></Card>
          ) : displayedItems.map((item, index) => (
            <ReportCard
              key={item.id}
              name={item.title}
              kind={index % 3 === 0 ? 'airpods' : index % 3 === 1 ? 'backpack' : 'keys'}
              type={item.itemType === 'LOST' ? 'Lost' : 'Found'}
              status={item.status}
              tone={item.status === 'RESOLVED' ? 'green' : item.status === 'CLAIMED' ? 'blue' : 'orange'}
              progress={item.status === 'RESOLVED' ? 100 : item.status === 'CLAIMED' ? 68 : 38}
              date={item.itemDate ? new Date(item.itemDate).toLocaleDateString() : 'Date not specified'}
              imageUrl={item.imageUrls?.[0]}
              onClick={() => onSelectItem(item.id)}
            />
          ))}
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
  date,
  imageUrl,
  onClick,
}: {
  name: string
  kind: string
  type: string
  status: string
  tone: "orange" | "blue" | "green"
  progress: number
  date?: string
  imageUrl?: string
  onClick?: () => void
}) {
  return (
    <Card className="report-card" onClick={onClick}>
      <div className="report-main">
        <ItemVisual kind={kind} imageUrl={imageUrl} />
        <div>
          <div className="item-name">{name}</div>
          <span>{type} • {date ?? 'Date not specified'}</span>
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

function Notifications({ go, onOpenItem }: { go: (s: Screen) => void; onOpenItem: (id: string) => void }) {
  const [notes, setNotes] = useState<Awaited<ReturnType<typeof getNotifications>>>([])
  const [loading, setLoading] = useState(false)
  const [markingRead, setMarkingRead] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const data = await getNotifications()
        if (active) setNotes(Array.isArray(data) ? data : [])
      } catch (loadError) {
        if (active) {
          setNotes([])
          setError(loadError instanceof Error ? loadError.message : 'Unable to load notifications.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  const handleMarkAllRead = async () => {
    try {
      setMarkingRead(true)
      setError('')
      await markAllNotificationsRead()
      const refreshed = await getNotifications()
      setNotes(Array.isArray(refreshed) ? refreshed : [])
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to mark notifications as read.')
    } finally {
      setMarkingRead(false)
    }
  }

  const openNotification = async (item: Awaited<ReturnType<typeof getNotifications>>[number]) => {
    try {
      if (!item.read) {
        await markNotificationRead(item.id)
        setNotes((current) => current.map((note) => note.id === item.id ? { ...note, read: true } : note))
      }
      if (item.itemId) onOpenItem(item.itemId)
      else go('home')
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to open this notification.')
    }
  }

  return (
    <MobilePage go={go}>
      <TopBar
        title="Notifications"
        back={() => go("home")}
        right={
          <div className="text-action" role="button" onClick={handleMarkAllRead}>
            {markingRead ? "Updating..." : "Mark all read"}
          </div>
        }
      />
      <div className="mobile-content">
        <div className="notification-group-label">NEW</div>
        {error && <div className="form-error">{error}</div>}
        {loading ? (
          <div className="loading-lines"><span /><span /><span /></div>
        ) : notes.length === 0 ? (
          <Card className="empty-state">
            <div className="empty-icon"><Icon name="bell" /></div>
            <strong>No notifications</strong>
            <span>Your campus updates will appear here.</span>
          </Card>
        ) : notes.map((item, index) => (
          <Card
            className={`notification-card ${item.read ? "" : "unread"}`}
            onClick={() => void openNotification(item)}
            key={item.id}
          >
            <div className={`notification-icon note-${index % 5}`}>
              <Icon name="bell" />
            </div>
            <div>
              <strong>{item.type.replace(/_/g, ' ')}</strong>
              <p>{item.message}</p>
              <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}</span>
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
  const [profile, setProfile] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [itemCounts, setItemCounts] = useState({ lost: 0, found: 0, resolved: 0 })
  const [nameDraft, setNameDraft] = useState('')
  const [phoneDraft, setPhoneDraft] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const [data, itemPage] = await Promise.all([getUserProfile(), getMyItems({ page: 0, size: 100 })])
        if (active) {
          setProfile(data)
          setNameDraft(data.name)
          setPhoneDraft(data.phone ?? '')
          setItemCounts({
            lost: itemPage.content.filter((item) => item.itemType === 'LOST').length,
            found: itemPage.content.filter((item) => item.itemType === 'FOUND').length,
            resolved: itemPage.content.filter((item) => item.status === 'RESOLVED').length,
          })
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load your profile.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  const name = profile?.name || "Your profile"
  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?"
  const phone = profile?.phone || "Phone not added"
  const email = profile?.email || ""

  const saveProfile = async () => {
    if (!nameDraft.trim()) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const updated = await updateUserProfile({ name: nameDraft.trim(), phone: phoneDraft })
      setProfile(updated)
      setEditing(false)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    setError('')
    try {
      const uploaded = await uploadImage(file)
      const updated = await updateUserProfile({ profileImage: uploaded.url })
      setProfile(updated)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to update profile image.')
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

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
        <label className="profile-avatar" title="Update profile photo">
          {profile?.profileImage ? <img className="profile-photo" src={resolveMediaUrl(profile.profileImage)} alt="Profile" /> : initials}
          <span>
            <Icon name="camera" size="sm" />
          </span>
          <input className="upload-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleProfileImage} disabled={uploadingImage} />
        </label>
        <div className="profile-name">{loading ? "Loading profile..." : name}</div>
        {!editing ? <span>{phone}</span> : (
          <div className="form-stack">
            <Field label="Full name" value={nameDraft} editable onChange={(event) => setNameDraft(event.target.value)} />
            <Field label="Phone" value={phoneDraft} editable onChange={(event) => setPhoneDraft(event.target.value)} />
          </div>
        )}
        <p>
          {email}
          <br />
          {profile?.role || "STUDENT"}
        </p>
        <div className="text-action" role="button" onClick={editing ? saveProfile : () => setEditing(true)}>
          {saving ? 'Saving...' : editing ? 'Save profile' : 'Edit profile'}
        </div>
        {uploadingImage && <span>Uploading profile photo...</span>}
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="stats-row">
        <div>
          <strong>{itemCounts.lost}</strong>
          <span>Lost</span>
        </div>
        <div>
          <strong>{itemCounts.found}</strong>
          <span>Found</span>
        </div>
        <div>
          <strong>{itemCounts.resolved}</strong>
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
        {profile?.role === 'ADMIN' && (
          <div className="admin-link" role="button" onClick={() => go("admin")}>
            <Icon name="shield" size="sm" /> Open KSIT Admin Portal
          </div>
        )}
      </div>
      {logoutDialog && (
        <Modal
          icon="logout"
          title="Log out of KSIT FIND?"
          copy="You’ll need to sign in with your authorized KSIT account to access reports and messages again."
          action="LOGOUT"
          destructive
          onClose={() => setLogoutDialog(false)}
          onAction={() => {
            clearAuthToken()
            go("login")
          }}
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
  ["users", "Users", "admin-users"],
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
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAdminStats>> | null>(null)
  const [items, setItems] = useState<ItemDto[]>([])
  const [claims, setClaims] = useState<ClaimDto[]>([])
  const [notifications, setNotifications] = useState<Awaited<ReturnType<typeof getNotifications>>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [data, itemList, claimList, notificationList] = await Promise.all([
          getAdminStats(),
          getAdminItems(),
          getAdminClaims(),
          getNotifications(),
        ])
        if (active) {
          setStats(data)
          setItems(itemList)
          setClaims(claimList)
          setNotifications(notificationList)
        }
      } catch (loadError) {
        if (active) {
          setStats(null)
          setError(loadError instanceof Error ? loadError.message : 'Unable to load the admin dashboard.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  const monthLabels = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - 5 + index)
    return date
  })
  const monthlyCounts = monthLabels.map((month) => {
    const monthItems = items.filter((item) => {
      if (!item.createdAt) return false
      const date = new Date(item.createdAt)
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
    })
    return {
      lost: monthItems.filter((item) => item.itemType === 'LOST').length,
      found: monthItems.filter((item) => item.itemType === 'FOUND').length,
      returned: monthItems.filter((item) => item.status === 'RESOLVED').length,
    }
  })
  const pathFor = (values: number[]) => {
    const max = Math.max(1, ...monthlyCounts.flatMap((count) => [count.lost, count.found, count.returned]))
    return values.map((value, index) => {
      const x = index * 600 / Math.max(1, values.length - 1)
      const y = 165 - value / max * 130
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`
    }).join(' ')
  }
  const locationCounts = Object.entries(items.reduce<Record<string, number>>((counts, item) => {
    counts[item.location] = (counts[item.location] ?? 0) + 1
    return counts
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxLocationCount = Math.max(1, ...locationCounts.map(([, count]) => count))
  const pendingClaims = claims.filter((claim) => claim.status === 'PENDING')
  const approvedClaims = claims.filter((claim) => claim.status === 'APPROVED')
  const itemReports = notifications.filter((notification) => notification.type === 'ITEM_REPORTED' && !notification.read)
  const lostPercentage = stats && stats.totalItems > 0 ? stats.lostItems / stats.totalItems * 100 : 0
  const openAdminTask = (icon: string) => {
    if (icon === 'shield') go('notifications')
    else if (icon === 'pin') go('admin-handover')
    else go('admin-claim')
  }

  const metrics: Array<[string, string, string, IconName]> = [
    [String(stats?.totalItems ?? 0), "Total Items", stats ? "Current reports" : "Live data unavailable", "box"],
    [String(stats?.lostItems ?? 0), "Lost", "Lost reports", "search"],
    [String(stats?.foundItems ?? 0), "Found", "Found reports", "file"],
    [String(stats?.activeClaims ?? 0), "Pending Claims", "Needs attention", "shield"],
    [String(stats?.resolvedItems ?? 0), "Resolved", "Resolved reports", "check"],
    [String(stats?.activeClaims ?? 0), "Pending Reviews", "Claims awaiting review", "clock"],
  ]

  return (
    <AdminLayout
      current="admin"
      go={go}
      title="Dashboard"
      subtitle={stats ? `Live admin overview • ${new Date().toLocaleDateString()}` : "Live campus lost & found overview"}
    >
      <div className="admin-content">
        {error && <div className="form-error">{error}</div>}
        <div className="metric-grid">
          {loading ? (
            <div className="loading-lines" style={{ gridColumn: '1 / -1' }}><span /><span /><span /></div>
          ) : metrics.map(([value, label, note, icon], index) => (
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
                  d={pathFor(monthlyCounts.map((count) => count.lost))}
                />
                <path
                  className="line found-line"
                  d={pathFor(monthlyCounts.map((count) => count.found))}
                />
                <path
                  className="line return-line"
                  d={pathFor(monthlyCounts.map((count) => count.returned))}
                />
              </svg>
              <div className="axis">
                {monthLabels.map((month) => <span key={`${month.getFullYear()}-${month.getMonth()}`}>{month.toLocaleDateString(undefined, { month: 'short' })}</span>)}
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
            <div className="donut" style={{ background: `conic-gradient(var(--color-brand) 0 ${lostPercentage}%, var(--color-success) ${lostPercentage}% 100%)` }}>
              <div>
                <strong>{stats?.totalItems ?? 0}</strong>
                <span>Total items</span>
              </div>
            </div>
            <div className="donut-stats">
              <span>
                <i className="blue-dot" />
                Lost <strong>{stats?.lostItems ?? 0}</strong>
              </span>
              <span>
                <i className="green-dot" />
                Found <strong>{stats?.foundItems ?? 0}</strong>
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
              {locationCounts.map(([label, count]) => (
                <div className="bar-row" key={label}>
                  <span>{label}</span>
                  <div>
                    <i style={{ width: `${count / maxLocationCount * 100}%` }} />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}
              {!loading && locationCounts.length === 0 && <div className="empty-state">No reports by location yet.</div>}
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
              ...pendingClaims.slice(0, 3).map((claim) => {
                const hours = claim.createdAt ? Math.max(0, Math.floor((Date.now() - new Date(claim.createdAt).getTime()) / 3600000)) : 0
                return [`Claim waiting ${hours} hours`, claim.itemTitle, 'warning'] as const
              }),
              ...approvedClaims.slice(0, Math.max(0, 3 - pendingClaims.length)).map((claim) =>
                ['Handover awaiting confirmation', claim.itemTitle, 'pin'] as const),
              ...itemReports.slice(0, Math.max(0, 3 - pendingClaims.length - approvedClaims.length)).map((notification) =>
                ['Listing reported', notification.message, 'shield'] as const),
            ].map(([title, copy, icon]) => (
              <div className="activity-row" key={title} role="button" tabIndex={0} onClick={() => openAdminTask(icon)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openAdminTask(icon) }}>
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
            {!loading && pendingClaims.length === 0 && approvedClaims.length === 0 && itemReports.length === 0 && (
              <div className="empty-state">No claims need attention.</div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

function AdminItems({ go }: { go: (s: Screen) => void }) {
  const [items, setItems] = useState<ItemDto[]>([])
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tabFilter, setTabFilter] = useState<'ALL' | 'LOST' | 'FOUND' | 'REVIEW'>('ALL')
  const [activeActions, setActiveActions] = useState<string | null>(null)
  const [itemToClose, setItemToClose] = useState<ItemDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadItems = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await getAdminItems())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load admin items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadItems() }, [])

  const visibleItems = items.filter((item) => {
    const matchesSearch = `${item.title} ${item.category} ${item.location} ${item.reporter?.name ?? ''}`
      .toLowerCase().includes(search.toLowerCase())
    const matchesTab = tabFilter === 'ALL'
      || item.itemType === tabFilter
      || (tabFilter === 'REVIEW' && (item.status === 'LOST' || item.status === 'FOUND'))
    return matchesSearch && matchesTab
      && (!categoryFilter || item.category.toLowerCase().includes(categoryFilter.toLowerCase()))
      && (!statusFilter || item.status === statusFilter)
  })
  const selectTab = (filter: typeof tabFilter) => setTabFilter(filter)
  const selectTabOnKey = (event: React.KeyboardEvent<HTMLSpanElement>, filter: typeof tabFilter) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectTab(filter)
    }
  }

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
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, users or report IDs" />
          </div>
          <div className="filter-button" role="button" tabIndex={0} onClick={() => setFilterOpen((open) => !open)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setFilterOpen((open) => !open) }}>
            <Icon name="settings" /> Filters
          </div>
          <Button wide={false} onClick={() => go("lost-item")}>+ ADD ITEM</Button>
        </div>
        {filterOpen && (
          <Card className="filter-panel">
            <div className="filter-title">Filter reports</div>
            <div className="filter-grid">
              <Field label="Category" value={categoryFilter} placeholder="Any category" editable onChange={(event) => setCategoryFilter(event.target.value)} />
              <label className="field-wrap">
                <span className="field-label">Status</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="">Any status</option>
                  <option value="LOST">Lost</option>
                  <option value="FOUND">Found</option>
                  <option value="CLAIMED">Claimed</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </label>
            </div>
            <Button wide={false} variant="secondary" onClick={() => { setCategoryFilter(''); setStatusFilter(''); setFilterOpen(false) }}>CLEAR FILTERS</Button>
          </Card>
        )}
        {error && <div className="form-error">{error}</div>}
        <div className="admin-tabs">
          <span className={tabFilter === 'ALL' ? 'active' : ''} role="button" tabIndex={0} onClick={() => selectTab('ALL')} onKeyDown={(event) => selectTabOnKey(event, 'ALL')}>
            All Items <b>{items.length}</b>
          </span>
          <span className={tabFilter === 'LOST' ? 'active' : ''} role="button" tabIndex={0} onClick={() => selectTab('LOST')} onKeyDown={(event) => selectTabOnKey(event, 'LOST')}>
            Lost <b>{items.filter((item) => item.itemType === 'LOST').length}</b>
          </span>
          <span className={tabFilter === 'FOUND' ? 'active' : ''} role="button" tabIndex={0} onClick={() => selectTab('FOUND')} onKeyDown={(event) => selectTabOnKey(event, 'FOUND')}>
            Found <b>{items.filter((item) => item.itemType === 'FOUND').length}</b>
          </span>
          <span className={tabFilter === 'REVIEW' ? 'active' : ''} role="button" tabIndex={0} onClick={() => selectTab('REVIEW')} onKeyDown={(event) => selectTabOnKey(event, 'REVIEW')}>
            Needs Review <b>{items.filter((item) => item.status === 'FOUND' || item.status === 'LOST').length}</b>
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
          {loading ? <div className="loading-lines"><span /><span /><span /></div> : visibleItems.map((item, index) => (
            <div className="table-row" key={item.id}>
              <div className="table-item">
                <ItemVisual
                  kind={index % 3 === 0 ? "phone" : index % 3 === 1 ? "backpack" : "keys"}
                  imageUrl={item.imageUrls?.[0]}
                />
                <strong>{item.title}</strong>
              </div>
              <span>
                <Badge tone={item.itemType === "LOST" ? "red" : "green"}>
                  {item.itemType}
                </Badge>
              </span>
              <span>{item.category}</span>
              <span>{item.location}</span>
              <span>{item.reporter?.name ?? 'Unknown'}</span>
              <span>{item.itemDate ? new Date(item.itemDate).toLocaleDateString() : '—'}</span>
              <span>
                <Badge
                  tone={item.status === "CLAIMED" ? "blue" : item.status === "RESOLVED" ? "green" : "orange"}
                >
                  {item.status}
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
                  onClick={() => setActiveActions(activeActions === item.id ? null : item.id)}
                >
                  •••
                </div>
                {activeActions === item.id && (
                  <div className="row-action-menu">
                    <div role="button" onClick={() => go("admin-claim")}>
                      <Icon name="check" size="sm" /> Review claims
                    </div>
                    <div
                      role="button"
                      className="danger"
                      onClick={() => setItemToClose(item)}
                    >
                      <Icon name="close" size="sm" /> Close Report
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!loading && visibleItems.length === 0 && <div className="empty-state">No items found.</div>}
          <div className="table-footer">
            <span>Showing {visibleItems.length} of {items.length} items</span>
          </div>
        </Card>
      </div>
      {itemToClose && (
        <Modal
          icon="warning"
          title="Close this report?"
          copy="This removes the report from active matching. The action is recorded and can be reviewed by an administrator."
          action="CLOSE REPORT"
          destructive
          onClose={() => setItemToClose(null)}
          onAction={async () => {
            try {
              await setAdminItemStatus(itemToClose.id, 'RESOLVED')
              setItemToClose(null)
              setActiveActions(null)
              await loadItems()
            } catch (actionError) {
              setError(actionError instanceof Error ? actionError.message : 'Unable to close this report.')
              setItemToClose(null)
            }
          }}
        />
      )}
    </AdminLayout>
  )
}

function AdminUsers({ go }: { go: (s: Screen) => void }) {
  const [users, setUsers] = useState<UserDto[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getAdminUsers()
      .then((data) => { if (active) setUsers(data) })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load users.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const changeRole = async (user: UserDto, role: UserDto['role']) => {
    setSavingId(user.id)
    setError('')
    try {
      const updated = await updateAdminUserRole(user.id, role)
      setUsers((current) => current.map((entry) => entry.id === updated.id ? updated : entry))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update user role.')
    } finally {
      setSavingId(null)
    }
  }

  const visibleUsers = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <AdminLayout current="admin-users" go={go} title="User Management" subtitle="Manage campus roles and account access">
      <div className="admin-content">
        <div className="table-tools">
          <div className="search-wide"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users by name, email, or role" /></div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <Card className="data-table">
          <div className="table-row table-header">
            <span>Name</span><span>Email</span><span>Phone</span><span>Role</span><span>Joined</span><span>Access</span>
          </div>
          {loading ? <div className="loading-lines"><span /><span /><span /></div> : visibleUsers.map((user) => (
            <div className="table-row" key={user.id}>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <span>{user.phone || '—'}</span>
              <span><Badge tone={user.role === 'ADMIN' ? 'blue' : user.role === 'STAFF' ? 'orange' : 'green'}>{user.role}</Badge></span>
              <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
              <span>
                <select value={user.role} disabled={savingId === user.id} onChange={(event) => void changeRole(user, event.target.value as UserDto['role'])}>
                  <option value="STUDENT">STUDENT</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </span>
            </div>
          ))}
          {!loading && visibleUsers.length === 0 && <div className="empty-state">No users found.</div>}
        </Card>
      </div>
    </AdminLayout>
  )
}

function AdminClaim({ go }: { go: (s: Screen) => void }) {
  const [checks, setChecks] = useState([false, false, false, false, false])
  const [rejectDialog, setRejectDialog] = useState(false)
  const [claims, setClaims] = useState<ClaimDto[]>([])
  const [selectedClaim, setSelectedClaim] = useState<ClaimDto | null>(null)
  const [reviewItem, setReviewItem] = useState<ItemDto | null>(null)
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const labels = [
    "Student identity verified",
    "Item description matches",
    "Ownership evidence provided",
    "Finder information verified",
    "Handover location confirmed",
  ]

  const loadClaims = async () => {
    setLoading(true)
    setError('')
    try {
      const [data, userList] = await Promise.all([getAdminClaims(), getAdminUsers()])
      setClaims(data)
      setSelectedClaim(data.find((claim) => claim.status === 'PENDING') ?? data[0] ?? null)
      setUsers(userList)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load claims.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadClaims() }, [])

  useEffect(() => {
    if (!selectedClaim) {
      setReviewItem(null)
      return
    }
    let active = true
    setReviewItem(null)
    getItemById(selectedClaim.itemId)
      .then((item) => { if (active) setReviewItem(item) })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load the reported item.')
      })
    return () => { active = false }
  }, [selectedClaim?.itemId])

  const claimant = users.find((user) => user.id === selectedClaim?.userId)
  const reporterEmail = reviewItem?.reporter?.email

  const reviewClaim = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedClaim) return
    if (status === 'APPROVED' && checks.some((checked) => !checked)) {
      setError('Complete the verification checklist before approving this claim.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const updated = await updateClaimStatus(selectedClaim.id, status)
      setSelectedClaim(updated)
      setClaims((current) => current.map((claim) => claim.id === updated.id ? updated : claim))
      setRejectDialog(false)
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to update this claim.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout
      current="admin-claim"
      go={go}
      title="Claim Review"
      subtitle={selectedClaim ? `Claim #${selectedClaim.id} • ${selectedClaim.status}` : 'Review pending ownership claims'}
    >
      <div className="admin-content">
        {error && <div className="form-error">{error}</div>}
        {claims.length > 1 && (
          <div className="field-wrap">
            <label className="field-label" htmlFor="claim-select">Select claim</label>
            <select id="claim-select" value={selectedClaim?.id ?? ''} onChange={(event) => setSelectedClaim(claims.find((claim) => claim.id === event.target.value) ?? null)}>
              {claims.map((claim) => <option key={claim.id} value={claim.id}>{claim.itemTitle} — {claim.status}</option>)}
            </select>
          </div>
        )}
        {loading ? <div className="loading-lines"><span /><span /><span /></div> : !selectedClaim ? (
          <Card className="empty-state"><strong>No claims to review</strong><span>Submitted ownership claims will appear here.</span></Card>
        ) : (
        <div className="claim-review-grid">
          <div className="review-column">
            <Card className="admin-item-summary">
              <ItemVisual kind="airpods" large />
              <div>
                <Badge tone="green">FOUND</Badge>
                <div className="admin-card-title">{selectedClaim.itemTitle}</div>
                <span>Item #{selectedClaim.itemId}</span>
                <div className="mini-details">
                  <div>
                    <span>Reported at</span>
                    <strong>{reviewItem?.location ?? 'Loading…'}</strong>
                  </div>
                  <div>
                    <span>Reported on</span>
                    <strong>{reviewItem?.itemDate ? new Date(reviewItem.itemDate).toLocaleString() : '—'}</strong>
                  </div>
                  <div>
                    <span>Currently</span>
                    <strong>{reviewItem?.custodyLocation || reviewItem?.status || '—'}</strong>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="evidence-card">
              <SectionTitle title="REPORTED DESCRIPTION" />
              <p>{reviewItem?.description ?? 'Loading item description…'}</p>
              {(reviewItem?.brand || reviewItem?.color) && <p>{[reviewItem.brand, reviewItem.color].filter(Boolean).join(' · ')}</p>}
              <SectionTitle title="CLAIM ANSWERS" />
              <div className="private-evidence"><Icon name="lock" /><p>{selectedClaim.evidence || 'No evidence text was supplied.'}</p></div>
            </Card>
          </div>
          <div className="review-column">
            <Card className="claimant-card">
              <div className="section-title">
                <span>CLAIMANT</span>
                <Badge tone="green">KSIT VERIFIED</Badge>
              </div>
              <div className="claimant-profile">
                <div className="avatar large">CL</div>
                <div>
                  <div className="admin-card-title">{claimant?.name ?? 'Claimant'}</div>
                  <span>{claimant?.email ?? `User ${selectedClaim.userId}`}</span>
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
                {selectedClaim.status === 'PENDING' && <>
                  <Button onClick={() => void reviewClaim('APPROVED')}>{saving ? 'SAVING...' : 'APPROVE CLAIM'}</Button>
                  <Button variant="danger" onClick={() => setRejectDialog(true)}>REJECT CLAIM</Button>
                </>}
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
                  <strong>{reviewItem?.reporter?.name ?? 'Listing reporter'}</strong>
                  <span>{reviewItem?.reporter?.email ?? 'Reporter details unavailable'}</span>
                </div>
              </div>
              {reporterEmail && <Button variant="secondary" icon="message" onClick={() => { window.location.href = `mailto:${reporterEmail}` }}>
                CONTACT REPORTER
              </Button>}
            </Card>
          </div>
        </div>
        )}
      </div>
      {rejectDialog && (
        <Modal
          icon="warning"
          title="Reject this ownership claim?"
          copy="The claimant will be notified and asked to contact the Lost & Found Desk if they need clarification."
          action="REJECT CLAIM"
          destructive
          onClose={() => setRejectDialog(false)}
          onAction={() => { void reviewClaim('REJECTED') }}
        />
      )}
    </AdminLayout>
  )
}

function AdminHandover({ go }: { go: (s: Screen) => void }) {
  const [claims, setClaims] = useState<ClaimDto[]>([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadClaims = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminClaims()
      setClaims(data.filter((claim) => claim.status === 'APPROVED'))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load approved claims.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadClaims() }, [])

  const verifyHandover = async (claimId: string) => {
    setSavingId(claimId)
    setError('')
    try {
      await completeHandover(claimId)
      setClaims((current) => current.filter((claim) => claim.id !== claimId))
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to confirm handover.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <AdminLayout
      current="admin-handover"
      go={go}
      title="Pending Handovers"
      subtitle="Coordinate and verify secure item collections"
    >
      <div className="admin-content">
        {error && <div className="form-error">{error}</div>}
        <div className="handover-metrics">
          <Card>
            <strong>{claims.length}</strong>
            <span>Awaiting collection</span>
          </Card>
          <Card>
            <strong>{loading ? '—' : claims.length}</strong>
            <span>Approved claims</span>
          </Card>
          <Card>
            <strong>—</strong>
            <span>Completed this month</span>
          </Card>
        </div>
        <div className="handover-admin-grid">
          {loading ? <div className="loading-lines"><span /><span /><span /></div> : claims.length === 0 ? (
            <Card className="empty-state"><strong>No pending handovers</strong><span>Approved claims appear here until staff confirms collection.</span></Card>
          ) : claims.map((claim) => (
            <Card className="handover-admin-card" key={claim.id}>
              <ItemVisual kind="airpods" />
              <div className="handover-admin-copy">
                <Badge tone="blue">READY FOR COLLECTION</Badge>
                <div className="admin-card-title">{claim.itemTitle}</div>
                <span>Claim #{claim.id}</span>
                <span><Icon name="pin" size="sm" /> KSIT Lost &amp; Found Desk</span>
              </div>
              <Button wide={false} onClick={() => void verifyHandover(claim.id)}>
                {savingId === claim.id ? 'SAVING...' : 'VERIFY HANDOVER'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

function Analytics({ go }: { go: (s: Screen) => void }) {
  const [items, setItems] = useState<ItemDto[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminItems()
      .then(setItems)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load analytics.'))
  }, [])

  const categoryCounts = Object.entries(items.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1
    return counts
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const locationCounts = Object.entries(items.reduce<Record<string, number>>((counts, item) => {
    counts[item.location] = (counts[item.location] ?? 0) + 1
    return counts
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maximumCategory = Math.max(1, ...categoryCounts.map(([, count]) => count))
  const maximumLocation = Math.max(1, ...locationCounts.map(([, count]) => count))
  const locationTotal = (name: string) => items.filter((item) => item.location.toLowerCase().includes(name.toLowerCase())).length
  return (
    <AdminLayout
      current="analytics"
      go={go}
      title="Campus Lost & Found Analytics"
      subtitle="Administrative insights • Current semester"
    >
      <div className="admin-content">
        {error && <div className="form-error">{error}</div>}
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
              {categoryCounts.map(([label, count]) => (
                <div key={label}>
                  <span>{label}</span>
                  <div>
                    <i style={{ width: `${Math.round(count / maximumCategory * 100)}%` }} />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}{categoryCounts.length === 0 && <div className="empty-state">No item analytics available.</div>}
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
              {locationCounts.map(([location, count], index) => (
                <div key={location}>
                  <span>{index + 1}</span>
                  <strong>{location}</strong>
                  <div>
                    <i style={{ width: `${Math.round(count / maximumLocation * 100)}%` }} />
                  </div>
                  <b>{count}</b>
                </div>
              ))}{locationCounts.length === 0 && <div className="empty-state">No location analytics available.</div>}
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
                MAIN BLOCK<span className="heat heat-high">{locationTotal('Main Block')}</span>
              </div>
              <div className="building library">
                LIBRARY<span className="heat heat-hot">{locationTotal('Library')}</span>
              </div>
              <div className="building canteen">
                CANTEEN<span className="heat heat-hot">{locationTotal('Canteen')}</span>
              </div>
              <div className="building academic">
                ACADEMIC BLOCK<span className="heat heat-medium">{locationTotal('Academic Block')}</span>
              </div>
              <div className="building parking">
                PARKING<span className="heat heat-low">{locationTotal('Parking')}</span>
              </div>
              <div className="building sports">
                SPORTS AREA<span className="heat heat-low">{locationTotal('Sports Area')}</span>
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
  ["admin-users", "22 Admin users"],
  ["admin-claim", "23 Claim review"],
  ["admin-handover", "24 Handovers"],
  ["analytics", "25 Analytics"],
  ["privacy", "26 Privacy"],
]

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [navigatorOpen, setNavigatorOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [createdItemId, setCreatedItemId] = useState<string | null>(null)
  const [reportKind, setReportKind] = useState<"lost" | "found">("lost")
  const [reportDraft, setReportDraft] = useState<ReportDraft>(emptyReportDraft)
  const [submittingReport, setSubmittingReport] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [feedbackState, setFeedbackState] =
    useState<"loading" | "error" | "empty" | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setNavigatorOpen(false)
  }, [screen])

  useEffect(() => {
    if (!getAuthToken()) return
    let active = true
    getCurrentUser()
      .then(() => {
        if (active) setScreen("home")
      })
      .catch(() => {
        clearAuthToken()
      })
    return () => {
      active = false
    }
  }, [])

  const go = (next: Screen) => {
    if (next === "lost-item") setReportKind("lost")
    if (next === "found") setReportKind("found")
    if (next !== "review" && next !== "found" && next !== "lost-item" && next !== "lost-details") {
      setReportError(null)
    }
    setScreen(next)
  }

  const selectItem = (id: string) => {
    setSelectedItemId(id)
    go("item")
  }

  const handleClaimSubmitted = (id: string) => {
    setSelectedClaimId(id)
    go("claim")
  }

  const selectClaim = (id: string) => {
    setSelectedClaimId(id)
    go("claim")
  }

  const handleReportSubmit = async () => {
    const itemName = reportDraft.itemName.trim()
    const category = reportDraft.category.trim()
    const location = reportDraft.location.trim()
    const description = reportDraft.description.trim()

    if (!itemName || !category || !location || !description || !reportDraft.date || !reportDraft.time) {
      setReportError("Please complete the category, item name, date, time, location, and description.")
      return
    }

    setSubmittingReport(true)
    setReportError(null)

    try {
      const itemDate = `${reportDraft.date}T${reportDraft.time}:00`

      const createdItem = await createItem({
        title: itemName,
        description,
        category,
        brand: reportDraft.brand.trim() || undefined,
        color: reportDraft.color.trim() || undefined,
        location,
        custodyLocation: reportKind === "found" ? reportDraft.currentLocation : undefined,
        itemDate,
        itemType: reportKind === "found" ? "FOUND" : "LOST",
        status: reportKind === "found" ? "FOUND" : "LOST",
        privateDetails: reportDraft.privateDetails || "",
        imageUrls: reportDraft.imageUrls,
      })

      setCreatedItemId(createdItem.id)
      setSelectedItemId(createdItem.id)
      setReportDraft(emptyReportDraft)
      setReportError(null)
      go("success")
    } catch (error) {
      setReportError(
        error instanceof Error ? error.message : "Unable to submit report.",
      )
    } finally {
      setSubmittingReport(false)
    }
  }

  const screens: Record<Screen, ReactNode> = {
    splash: <Splash go={go} />,
    login: <Login go={go} />,
    home: <Home go={go} onSelectItem={selectItem} />,
    search: <SearchScreen go={go} onSelectItem={selectItem} />,
    "lost-item": (
      <ReportLostItem
        go={go}
        draft={reportDraft}
        setDraft={setReportDraft}
      />
    ),
    "lost-details": (
      <LostDetails
        go={go}
        draft={reportDraft}
        setDraft={setReportDraft}
      />
    ),
    review: (
      <Review
        go={go}
        draft={reportDraft}
        onSubmit={handleReportSubmit}
        submitting={submittingReport}
        error={reportError}
      />
    ),
    success: <Success go={go} kind={reportKind} itemId={createdItemId} />,
    found: (
      <FoundForm
        go={go}
        draft={reportDraft}
        setDraft={setReportDraft}
        onSubmit={handleReportSubmit}
        submitting={submittingReport}
        error={reportError}
      />
    ),
    item: <ItemDetails go={go} itemId={selectedItemId} />,
    match: <Match go={go} itemId={selectedItemId} onSelectItem={selectItem} />,
    verify: <Verify go={go} itemId={selectedItemId} onSubmitted={handleClaimSubmitted} />,
    claim: <ClaimStatus go={go} claimId={selectedClaimId} />,
    chat: <Chat go={go} claimId={selectedClaimId} />,
    handover: <Handover go={go} claimId={selectedClaimId} />,
    returned: <Returned go={go} claimId={selectedClaimId} />,
    reports: <Reports go={go} onSelectItem={selectItem} onSelectClaim={selectClaim} />,
    notifications: <Notifications go={go} onOpenItem={selectItem} />,
    profile: <Profile go={go} />,
    privacy: <Privacy go={go} />,
    admin: <AdminDashboard go={go} />,
    "admin-items": <AdminItems go={go} />,
    "admin-users": <AdminUsers go={go} />,
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
