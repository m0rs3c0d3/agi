import './Settings.css'

function Settings() {
  return (
    <div className="settings">
      <header className="page-header">
        <h1>Settings</h1>
      </header>

      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Dark Mode</span>
              <span className="setting-desc">Always on</span>
            </div>
            <div className="toggle active">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Font Size</span>
              <span className="setting-desc">Medium</span>
            </div>
            <span className="setting-chevron">›</span>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Sync</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Auto Sync</span>
              <span className="setting-desc">Sync changes automatically</span>
            </div>
            <div className="toggle">
              <div className="toggle-knob"></div>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Sync Now</span>
              <span className="setting-desc">Last synced: Just now</span>
            </div>
            <span className="setting-chevron">›</span>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>About</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Version</span>
            </div>
            <span className="setting-value">0.1.0</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Settings
