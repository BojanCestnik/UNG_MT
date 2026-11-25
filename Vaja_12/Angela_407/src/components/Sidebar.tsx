import type { PageName } from '../types'

type SidebarProps = {
  activePage: PageName
  onPageChange: (page: PageName) => void
}

const navigationItems: { page: PageName; icon: string }[] = [
  { page: 'Dashboard', icon: '▦' },
  { page: 'My Coupons', icon: '▤' },
  { page: 'Favourite Stores', icon: '♡' },
  { page: 'Archive', icon: '▣' },
]

function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">S</div>
        <span>ShopWallet</span>
      </div>

      <p className="nav-label">MENU</p>

      {navigationItems.map(({ page, icon }) => (
        <button
          type="button"
          key={page}
          className={`nav-item ${activePage === page ? 'selected' : ''}`}
          aria-current={activePage === page ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {icon}
          <span>{page}</span>
        </button>
      ))}

      <div className="sidebar-bottom">
        <p>YOUR PERSONAL COUPON WALLET</p>
        <span>Keep your discounts in one place.</span>
      </div>
    </aside>
  )
}

export default Sidebar
