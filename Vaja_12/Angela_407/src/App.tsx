
import { useMemo, useState } from 'react'
import './App.css'

type Coupon = {
  id: number
  store: string
  description: string
  discount: string
  category: string
  expires: string
  daysLeft: number
  favorite: boolean
  used: boolean
}

const initialCoupons: Coupon[] = [
  {
    id: 1,
    store: 'Zara',
    description: 'Discount on your next purchase',
    discount: '20%',
    category: 'Fashion',
    expires: '10 Nov 2026',
    daysLeft: 2,
    favorite: true,
    used: false,
  },
  {
    id: 2,
    store: 'dm',
    description: 'Discount on selected products',
    discount: '€5',
    category: 'Beauty',
    expires: '12 Nov 2026',
    daysLeft: 4,
    favorite: true,
    used: false,
  },
  {
    id: 3,
    store: 'Nike',
    description: 'Special online shopping offer',
    discount: '15%',
    category: 'Sports',
    expires: '20 Nov 2026',
    daysLeft: 12,
    favorite: false,
    used: false,
  },
]

function App() {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState('Dashboard')

  const activeCoupons = coupons.filter(coupon => !coupon.used)

  const filteredCoupons = useMemo(() => {
    return activeCoupons.filter(coupon =>
      `${coupon.store} ${coupon.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [activeCoupons, search])

  function toggleFavorite(id: number) {
    setCoupons(current =>
      current.map(coupon =>
        coupon.id === id
          ? { ...coupon, favorite: !coupon.favorite }
          : coupon
      )
    )
  }

  function markAsUsed(id: number) {
    const confirmed = window.confirm('Mark this coupon as used?')

    if (confirmed) {
      setCoupons(current =>
        current.map(coupon =>
          coupon.id === id ? { ...coupon, used: true } : coupon
        )
      )
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>ShopWallet</span>
        </div>

        <p className="nav-label">MENU</p>

        {['Dashboard', 'My Coupons', 'Favourite Stores', 'Archive'].map(page => (
          <button
            key={page}
            className={`nav-item ${activePage === page ? 'selected' : ''}`}
            onClick={() => setActivePage(page)}
          >
            {page === 'Dashboard' && '▦'}
            {page === 'My Coupons' && '▤'}
            {page === 'Favourite Stores' && '♡'}
            {page === 'Archive' && '▣'}
            <span>{page}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <p>YOUR PERSONAL COUPON WALLET</p>
          <span>Keep your discounts in one place.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR SHOPPING COMPANION</p>
            <h1>{activePage}</h1>
          </div>
          <div className="profile">A</div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow light">WELCOME TO YOUR WALLET</p>
            <h2>Save more. Shop smarter.</h2>
            <p>All your shopping discounts, organised in one place.</p>
          </div>
          <div className="welcome-symbol">%</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon blue">▤</span>
            <p>Active coupons</p>
            <h3>{activeCoupons.length}</h3>
          </div>

          <div className="stat-card">
            <span className="stat-icon orange">◷</span>
            <p>Expiring soon</p>
            <h3>{activeCoupons.filter(c => c.daysLeft <= 3).length}</h3>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">€</span>
            <p>Total savings</p>
            <h3>€0.00</h3>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <h2>{activePage === 'Dashboard' ? 'Your coupons' : activePage}</h2>
            <p>Keep track of your available discounts.</p>
          </div>
          <button className="primary-button" onClick={() => alert('The Add Coupon form is coming next!')}>
            + Add coupon
          </button>
        </section>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by store or coupon description..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </div>

        <section className="coupon-grid">
          {filteredCoupons.map(coupon => (
            <article className="coupon-card" key={coupon.id}>
              <div className="coupon-top">
                <span className="category">{coupon.category}</span>
                <button
                  className={`favorite ${coupon.favorite ? 'is-favorite' : ''}`}
                  onClick={() => toggleFavorite(coupon.id)}
                  aria-label="Toggle favourite"
                >
                  {coupon.favorite ? '♥' : '♡'}
                </button>
              </div>

              <h3>{coupon.store}</h3>
              <p className="coupon-description">{coupon.description}</p>

              <div className="discount">{coupon.discount} <span>OFF</span></div>

              <div className="coupon-footer">
                <div>
                  <span className="expiry-label">EXPIRES</span>
                  <p>{coupon.expires}</p>
                </div>
                <span className={`expiry-badge ${coupon.daysLeft <= 3 ? 'warning' : ''}`}>
                  {coupon.daysLeft} days left
                </span>
              </div>

              <button
                className="used-button"
                onClick={() => markAsUsed(coupon.id)}
              >
                Mark as used
              </button>
            </article>
          ))}

          {filteredCoupons.length === 0 && (
            <p className="empty-message">No coupons found. Try another search.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
