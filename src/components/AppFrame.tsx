import Link from "next/link";

type AppFrameProps = {
  title: string;
  current: "today" | "history";
  children: React.ReactNode;
};

export function AppFrame({ title, current, children }: AppFrameProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 className="brand">
          Daily log
          <span>{title}</span>
        </h1>
        <nav className="nav" aria-label="Primary">
          <Link href="/" aria-current={current === "today" ? "page" : undefined}>
            Today
          </Link>
          <Link href="/history" aria-current={current === "history" ? "page" : undefined}>
            History
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
