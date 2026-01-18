import './Notes.css'

const sampleNotes = [
  { id: 1, title: 'Getting Started', preview: 'Welcome to your mobile coding space...', date: 'Today' },
  { id: 2, title: 'Ideas', preview: 'Quick thoughts and brainstorming...', date: 'Yesterday' },
  { id: 3, title: 'Code Snippets', preview: 'Useful code patterns to remember...', date: 'Jan 15' },
]

function Notes() {
  return (
    <div className="notes">
      <header className="page-header">
        <h1>Notes</h1>
        <button className="add-btn">+</button>
      </header>

      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input type="text" placeholder="Search notes..." />
      </div>

      <div className="notes-list">
        {sampleNotes.map((note) => (
          <div key={note.id} className="note-card">
            <div className="note-content">
              <h3>{note.title}</h3>
              <p>{note.preview}</p>
            </div>
            <span className="note-date">{note.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notes
