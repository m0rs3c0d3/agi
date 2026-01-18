import './Projects.css'

const sampleProjects = [
  { id: 1, name: 'Mobile App', description: 'React Native project', status: 'active' },
  { id: 2, name: 'API Server', description: 'Node.js backend', status: 'active' },
  { id: 3, name: 'Landing Page', description: 'Marketing site', status: 'completed' },
]

function Projects() {
  return (
    <div className="projects">
      <header className="page-header">
        <h1>Projects</h1>
        <button className="add-btn">+</button>
      </header>

      <div className="project-list">
        {sampleProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-info">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <span className={`status-badge ${project.status}`}>
              {project.status}
            </span>
          </div>
        ))}
      </div>

      <div className="empty-state">
        <p>Tap + to create a new project</p>
      </div>
    </div>
  )
}

export default Projects
