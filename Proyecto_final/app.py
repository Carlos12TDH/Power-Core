# app.py - Aplicación Flask Principal
from flask import Flask, render_template, request, jsonify, session
from models import db, Usuario
from datetime import datetime

app = Flask(__name__)

# =====================================================
# CONFIGURACIÓN
# =====================================================
app.config['SECRET_KEY'] = 'power_core_secret_key_2025_cambiala'

# IMPORTANTE: Cambia 'tu_password' por tu contraseña de PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Pepito1200@localhost/init_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar base de datos
db.init_app(app)

# =====================================================
# RUTAS PRINCIPALES
# =====================================================

@app.route('/')
def index():
    """Página principal"""
    return render_template('Power_core-index.html')

@app.route('/registro')
def registro():
    """Página de registro/login"""
    plan = request.args.get('plan', '')
    return render_template('registro.html', plan=plan)

# =====================================================
# API - VERIFICAR NOMBRE DE PERFIL
# =====================================================

@app.route('/api/verificar-nombre-perfil', methods=['POST'])
def verificar_nombre_perfil():
    """Verifica si el nombre de perfil ya existe"""
    try:
        data = request.get_json()
        nombre_perfil = data.get('nombre_perfil', '').strip().lower()
        
        if not nombre_perfil:
            return jsonify({
                'disponible': False,
                'mensaje': 'Nombre de perfil requerido'
            })
        
        # Verificar si ya existe
        usuario_existe = Usuario.query.filter_by(nombre_perfil=nombre_perfil).first()
        
        if usuario_existe:
            return jsonify({
                'disponible': False,
                'mensaje': 'Este nombre de perfil ya está en uso'
            })
        
        return jsonify({
            'disponible': True,
            'mensaje': 'Nombre de perfil disponible'
        })
    
    except Exception as e:
        print(f"Error al verificar nombre: {str(e)}")
        return jsonify({
            'disponible': False,
            'mensaje': 'Error al verificar'
        }), 500

# =====================================================
# API - LOGIN
# =====================================================

@app.route('/api/login', methods=['POST'])
def login():
    """Iniciar sesión"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'mensaje': 'Email y contraseña requeridos'
            }), 400
        
        # Buscar usuario
        usuario = Usuario.query.filter_by(email=email).first()
        
        if not usuario or not usuario.check_password(password):
            return jsonify({
                'success': False,
                'mensaje': 'Email o contraseña incorrectos'
            }), 401
        
        if not usuario.activo:
            return jsonify({
                'success': False,
                'mensaje': 'Usuario inactivo'
            }), 403
        
        # Guardar en sesión
        session['user_id'] = usuario.id
        session['nombre_perfil'] = usuario.nombre_perfil
        
        return jsonify({
            'success': True,
            'mensaje': '¡Inicio de sesión exitoso!',
            'usuario': usuario.to_dict()
        })
    
    except Exception as e:
        print(f"Error en login: {str(e)}")
        return jsonify({
            'success': False,
            'mensaje': 'Error al iniciar sesión'
        }), 500

# =====================================================
# API - REGISTRO
# =====================================================

@app.route('/api/registro', methods=['POST'])
def registrar_usuario():
    """Registrar nuevo usuario"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        campos_requeridos = ['nombre_perfil', 'nombre', 'apellido', 'email', 
                           'password', 'telefono', 'fecha_nacimiento', 'genero', 'plan']
        
        for campo in campos_requeridos:
            if not data.get(campo):
                return jsonify({
                    'success': False,
                    'mensaje': f'Campo {campo} requerido'
                }), 400
        
        # Verificar nombre de perfil único
        nombre_perfil = data['nombre_perfil'].strip().lower()
        if Usuario.query.filter_by(nombre_perfil=nombre_perfil).first():
            return jsonify({
                'success': False,
                'mensaje': 'Este nombre de perfil ya está en uso'
            }), 400
        
        # Verificar email único
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'mensaje': 'Este email ya está registrado'
            }), 400
        
        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            nombre_perfil=nombre_perfil,
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            telefono=data['telefono'],
            fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date(),
            genero=data['genero'],
            plan=data['plan']
        )
        
        # Hashear contraseña
        nuevo_usuario.set_password(data['password'])
        
        # Guardar en base de datos
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        # Iniciar sesión automáticamente
        session['user_id'] = nuevo_usuario.id
        session['nombre_perfil'] = nuevo_usuario.nombre_perfil
        
        return jsonify({
            'success': True,
            'mensaje': '¡Registro exitoso! Bienvenido a Power Core',
            'usuario': nuevo_usuario.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error al registrar: {str(e)}")
        return jsonify({
            'success': False,
            'mensaje': f'Error al registrar: {str(e)}'
        }), 500

# =====================================================
# API - LOGOUT
# =====================================================

@app.route('/api/logout', methods=['POST'])
def logout():
    """Cerrar sesión"""
    session.clear()
    return jsonify({
        'success': True,
        'mensaje': 'Sesión cerrada'
    })

# =====================================================
# API - USUARIO ACTUAL
# =====================================================

@app.route('/api/usuario-actual')
def usuario_actual():
    """Obtener usuario actual de la sesión"""
    if 'user_id' not in session:
        return jsonify({'logueado': False})
    
    usuario = Usuario.query.get(session['user_id'])
    if not usuario:
        session.clear()
        return jsonify({'logueado': False})
    
    return jsonify({
        'logueado': True,
        'usuario': usuario.to_dict()
    })

# =====================================================
# INICIALIZACIÓN
# =====================================================

with app.app_context():
    # Crear todas las tablas
    db.create_all()
    print("✅ Base de datos inicializada")
    
    # =====================================================
# API - CAMBIAR CONTRASEÑA
# =====================================================

@app.route('/api/cambiar-password', methods=['POST'])
def cambiar_password():
    """Cambiar contraseña del usuario"""
    try:
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'mensaje': 'Debes iniciar sesión'
            }), 401
        
        data = request.get_json()
        password_actual = data.get('password_actual')
        password_nueva = data.get('password_nueva')
        password_confirmar = data.get('password_confirmar')
        
        if not password_actual or not password_nueva or not password_confirmar:
            return jsonify({
                'success': False,
                'mensaje': 'Todos los campos son requeridos'
            }), 400
        
        if password_nueva != password_confirmar:
            return jsonify({
                'success': False,
                'mensaje': 'Las contraseñas nuevas no coinciden'
            }), 400
        
        if len(password_nueva) < 6:
            return jsonify({
                'success': False,
                'mensaje': 'La contraseña debe tener al menos 6 caracteres'
            }), 400
        
        usuario = Usuario.query.get(session['user_id'])
        
        if not usuario.check_password(password_actual):
            return jsonify({
                'success': False,
                'mensaje': 'Contraseña actual incorrecta'
            }), 401
        
        usuario.set_password(password_nueva)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'mensaje': 'Contraseña actualizada exitosamente'
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Error al cambiar contraseña: {str(e)}")
        return jsonify({
            'success': False,
            'mensaje': 'Error al cambiar contraseña'
        }), 500

# =====================================================
# API - ACTUALIZAR FOTO DE PERFIL
# =====================================================

@app.route('/api/actualizar-foto', methods=['POST'])
def actualizar_foto():
    """Actualizar foto de perfil (URL de la foto)"""
    try:
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'mensaje': 'Debes iniciar sesión'
            }), 401
        
        data = request.get_json()
        foto_url = data.get('foto_url')
        
        if not foto_url:
            return jsonify({
                'success': False,
                'mensaje': 'URL de foto requerida'
            }), 400
        
        usuario = Usuario.query.get(session['user_id'])
        usuario.foto_perfil = foto_url
        db.session.commit()
        
        return jsonify({
            'success': True,
            'mensaje': 'Foto actualizada',
            'foto_url': foto_url
        })
    
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar foto: {str(e)}")
        return jsonify({
            'success': False,
            'mensaje': 'Error al actualizar foto'
        }), 500

if __name__ == '__main__':
    print("🚀 Iniciando Power Core Gym...")
    print("📍 Servidor corriendo en: http://localhost:3000")
    app.run(debug=True, host='0.0.0.0', port=3000)