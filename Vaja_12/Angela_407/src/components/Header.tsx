type HeaderProps = {
  pageTitle: string
}

function Header({ pageTitle }: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">YOUR SHOPPING COMPANION</p>
        <h1>{pageTitle}</h1>
      </div>
      <div className="profile">A</div>
    </header>
  )
}

export default Header
