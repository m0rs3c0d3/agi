import './Home.css'

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>AGI Mobile</h1>
        <p className="subtitle">Vibe code anywhere</p>
      </header>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button className="action-card">
            <span className="action-icon">+</span>
            <span>New Project</span>
          </button>
          <button className="action-card">
            <span className="action-icon">✎</span>
            <span>New Note</span>
          </button>
          <button className="action-card">
            <span className="action-icon">⚡</span>
            <span>Quick Run</span>
          </button>
          <button className="action-card">
            <span className="action-icon">☁</span>
            <span>Sync</span>
          </button>
        </div>
      </section>

      <section className="recent">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <span className="activity-title">Welcome to AGI Mobile</span>
              <span className="activity-time">Just now</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
