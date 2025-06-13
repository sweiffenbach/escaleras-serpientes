import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import '../assets/styles/auth.css';

function Register() {
  const [formData, setFormData] = useState({
    NombreUsuario: '',
    Email: '',
    Contraseña: '',
    confirmarContraseña: '',
    Rol: 'jugador'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes al escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Solo se permiten archivos de imagen (JPG, PNG, GIF)');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede ser mayor a 5MB');
        return;
      }
      
      setProfileImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error si había uno
      if (error) setError('');
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    // Limpiar el input file
    const fileInput = document.getElementById('profileImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    if (formData.Contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.Contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      // Preparar datos sin el campo de confirmación
      const { confirmarContraseña: _removed, ...registerData } = formData;
      
      // Si hay imagen, la agregamos a los datos
      if (profileImage) {
        // En una implementación real, aquí subirías la imagen al servidor
        // Por ahora simulamos que se guarda
        registerData.Avatar = profileImage.name;
      }
      
      await register(registerData);
      
      setSuccess('¡Registro exitoso! Redirigiendo...');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/partidas');
      }, 2000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Únete para comenzar a jugar Escaleras y Serpientes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="NombreUsuario">Nombre de Usuario</label>
            <input
              type="text"
              id="NombreUsuario"
              name="NombreUsuario"
              value={formData.NombreUsuario}
              onChange={handleChange}
              required
              placeholder="Tu nombre de usuario"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Contraseña">Contraseña</label>
            <input
              type="password"
              id="Contraseña"
              name="Contraseña"
              value={formData.Contraseña}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarContraseña"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
          </div>

          {/* Sección de imagen de perfil */}
          <div className="form-group">
            <label htmlFor="profileImage">Imagen de Perfil (Opcional)</label>
            <div className="image-upload-section">
              {!imagePreview ? (
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="profileImage" className="file-input-label">
                    <div className="upload-icon">📷</div>
                    <span>Seleccionar imagen</span>
                    <small>JPG, PNG o GIF (máx. 5MB)</small>
                  </label>
                </div>
              ) : (
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="preview-image"
                  />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="remove-image-btn"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="Rol">Tipo de Usuario</label>
            <select
              id="Rol"
              name="Rol"
              value={formData.Rol}
              onChange={handleChange}
            >
              <option value="jugador">Jugador</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? {' '}
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;