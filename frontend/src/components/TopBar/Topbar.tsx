import "./Topbar.scss";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo">✓</span>
        <span className="topbar__name">StressedOut</span>
      </div>
      <nav className="topbar__nav">
        <a href="#" className="topbar__link topbar__link--active">
          Minhas Tarefas
        </a>
      </nav>
    </header>
  );
}