import '../assets/styles/about.css';

function About() {
  const teamMembers = [
    {
      name: "Amparo Johnson",
      role: "Full Stack Developer",
      email: "amparo.johnson@uc.cl",
      description: "Especialista en backend con Koa.js y bases de datos. Apasionada por crear sistemas robustos y escalables.",
      skills: ["Node.js", "PostgreSQL", "API Design", "Sequelize"]
    },
    {
      name: "Sofía Weiffenbach",
      role: "Frontend Developer", 
      email: "sweiffenbach@uc.cl",
      description: "Experta en React y diseño de interfaces. Se enfoca en crear experiencias de usuario intuitivas y atractivas.",
      skills: ["React", "CSS", "UI/UX", "JavaScript"]
    }
  ];

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>Conoce al Equipo</h1>
          <p className="hero-subtitle">
            Somos Los3, un equipo de desarrolladores apasionados por crear 
            experiencias de juego únicas y divertidas.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Nuestro Equipo</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">
                  {member.name.charAt(0)}
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-email">{member.email}</p>
                  <p className="member-description">{member.description}</p>
                  <div className="member-skills">
                    {member.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section className="project-section">
        <div className="container">
          <h2>Sobre el Proyecto</h2>
          <div className="project-content">
            <div className="project-description">
              <h3>Escaleras y Serpientes Renovado</h3>
              <p>
                Este proyecto nace como parte del curso <strong>IIC2513 - Tecnologías y Aplicaciones Web </strong> 
                en la Pontificia Universidad Católica de Chile. Nuestro objetivo es modernizar el clásico 
                juego de Escaleras y Serpientes, añadiendo nuevas mecánicas y tecnologías web actuales.
              </p>
              
              <p>
                Hemos implementado un sistema de cartas especiales, monedas virtuales, 
                casillas con efectos únicos y un sistema multijugador en tiempo real que 
                transforma la experiencia tradicional en algo completamente nuevo y emocionante.
              </p>
            </div>
            
            <div className="project-features">
              <h4>Características Destacadas</h4>
              <ul>
                <li>🎮 Multijugador en tiempo real</li>
                <li>🃏 Sistema de cartas especiales</li>
                <li>💰 Economía de monedas virtuales</li>
                <li>🏆 Sistema de estadísticas y logros</li>
                <li>🎲 Mecánicas de juego innovadoras</li>
                <li>📱 Diseño responsive y moderno</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2>Desarrollo del Proyecto</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Entrega 1 - Diseño y Planificación</h4>
                <p>Definición de reglas, mockups y arquitectura del sistema</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Entrega 2 - Backend y Base de Datos</h4>
                <p>Implementación de API REST, modelos de datos y lógica del juego</p>
              </div>
            </div>
            
            <div className="timeline-item active">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Entrega 3 - Frontend y Integración</h4>
                <p>Desarrollo de interfaz React, autenticación y conexión completa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2>¿Preguntas o Sugerencias?</h2>
          <p>Estamos siempre abiertos a retroalimentación y mejoras. No dudes en contactarnos:</p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Repositorio:</strong> 
              <a href="https://github.com/IIC2513/Los3_front_s2" target="_blank" rel="noopener noreferrer">
                GitHub - Los3_front_s2
              </a>
            </div>
            <div className="contact-item">
              <strong>Curso:</strong> IIC2513 - Tecnologías y Aplicaciones Web
            </div>
            <div className="contact-item">
              <strong>Profesor:</strong> Hernán Cabrera
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;