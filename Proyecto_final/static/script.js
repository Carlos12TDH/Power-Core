/* =====================================================
   JAVASCRIPT COMPLETO PARA POWER CORE GYM
   REEMPLAZA TODO EL CONTENIDO DE script.js CON ESTO
   ===================================================== */

// =====================================================
// CARRUSEL
// =====================================================

let diapositivaActual = 0;
const diapositivas = document.querySelectorAll('.diapositiva-carrusel');
const totalDiapositivas = diapositivas.length;
const contenedor = document.getElementById('contenedorCarrusel');
const contenedorPuntos = document.getElementById('puntosCarrusel');

if (contenedor && contenedorPuntos) {
    function crearPuntos() {
        for (let i = 0; i < totalDiapositivas; i++) {
            const punto = document.createElement('div');
            punto.className = 'punto';
            if (i === 0) punto.classList.add('activo');
            punto.onclick = function() { irADiapositiva(i); };
            contenedorPuntos.appendChild(punto);
        }
    }

    function moverCarrusel(direccion) {
        diapositivaActual += direccion;
        if (diapositivaActual < 0) {
            diapositivaActual = totalDiapositivas - 1;
        } else if (diapositivaActual >= totalDiapositivas) {
            diapositivaActual = 0;
        }
        actualizarCarrusel();
    }

    function irADiapositiva(indice) {
        diapositivaActual = indice;
        actualizarCarrusel();
    }

    function actualizarCarrusel() {
        contenedor.style.transform = 'translateX(-' + (diapositivaActual * 100) + '%)';
        const puntos = document.querySelectorAll('.punto');
        puntos.forEach(function(punto, indice) {
            punto.classList.toggle('activo', indice === diapositivaActual);
        });
    }

    let intervaloCarrusel = setInterval(function() {
        moverCarrusel(1);
    }, 5000);

    contenedor.addEventListener('mouseenter', function() {
        clearInterval(intervaloCarrusel);
    });

    contenedor.addEventListener('mouseleave', function() {
        intervaloCarrusel = setInterval(function() {
            moverCarrusel(1);
        }, 5000);
    });

    crearPuntos();
}

// =====================================================
// ANIMACIONES DE SCROLL
// =====================================================

const opcionesObservador = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const callbackObservador = function(entradas) {
    entradas.forEach(function(entrada) {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
        }
    });
};

const observador = new IntersectionObserver(callbackObservador, opcionesObservador);
const tarjetasCaracteristicas = document.querySelectorAll('.tarjeta-caracteristica');

tarjetasCaracteristicas.forEach(function(tarjeta) {
    observador.observe(tarjeta);
});

// =====================================================
// SMOOTH SCROLL
// =====================================================

document.querySelectorAll('a[href^="#"]').forEach(function(enlace) {
    enlace.addEventListener('click', function(evento) {
        evento.preventDefault();
        const destino = document.querySelector(this.getAttribute('href'));
        if (destino) {
            const offsetNavegacion = 80;
            const posicionElemento = destino.getBoundingClientRect().top;
            const posicionScroll = posicionElemento + window.pageYOffset - offsetNavegacion;
            window.scrollTo({
                top: posicionScroll,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================
// HOVER ENTRENADORES
// =====================================================

const tarjetasEntrenador = document.querySelectorAll('.tarjeta-entrenador');
tarjetasEntrenador.forEach(function(tarjeta) {
    tarjeta.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    tarjeta.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// =====================================================
// CARGA DE PÁGINA
// =====================================================

window.addEventListener('load', function() {
    document.body.classList.add('pagina-cargada');
    const navegacion = document.getElementById('barra-navegacion');
    if (navegacion) {
        navegacion.style.opacity = '0';
        navegacion.style.transform = 'translateY(-100%)';
        setTimeout(function() {
            navegacion.style.transition = 'all 0.5s ease';
            navegacion.style.opacity = '1';
            navegacion.style.transform = 'translateY(0)';
        }, 100);
    }
});

// =====================================================
// NAVEGACIÓN CON SCROLL
// =====================================================

let ultimaPosicionScroll = 0;
const navegacion = document.getElementById('barra-navegacion');

if (navegacion) {
    window.addEventListener('scroll', function() {
        const posicionActual = window.pageYOffset;
        if (posicionActual > 100) {
            navegacion.style.background = 'rgba(0, 0, 0, 0.95)';
            navegacion.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navegacion.style.background = 'rgba(0, 0, 0, 0.9)';
            navegacion.style.boxShadow = 'none';
        }
        ultimaPosicionScroll = posicionActual;
    });
}

// =====================================================
// TOUCH PARA MÓVILES
// =====================================================

if (contenedor) {
    let puntoInicioX = 0;
    let puntoFinalX = 0;

    contenedor.addEventListener('touchstart', function(evento) {
        puntoInicioX = evento.changedTouches[0].screenX;
    }, { passive: true });

    contenedor.addEventListener('touchend', function(evento) {
        puntoFinalX = evento.changedTouches[0].screenX;
        manejarGesto();
    }, { passive: true });

    function manejarGesto() {
        const distanciaMinima = 50;
        if (puntoFinalX < puntoInicioX - distanciaMinima) {
            moverCarrusel(1);
        }
        if (puntoFinalX > puntoInicioX + distanciaMinima) {
            moverCarrusel(-1);
        }
    }
}

// =====================================================
// ANIMACIÓN PLANES
// =====================================================

const observadorPlanes = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(entrada) {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.tarjeta-plan').forEach(function(tarjeta) {
    observadorPlanes.observe(tarjeta);
});

// =====================================================
// AJUSTAR ALTURA CARRUSEL
// =====================================================

function ajustarAlturaCarrusel() {
    const carrusel = document.querySelector('.seccion-carrusel');
    if (!carrusel) return;
    
    const anchoVentana = window.innerWidth;
    if (anchoVentana < 480) {
        carrusel.style.height = '400px';
    } else if (anchoVentana < 768) {
        carrusel.style.height = '450px';
    } else if (anchoVentana < 968) {
        carrusel.style.height = '500px';
    } else {
        carrusel.style.height = '600px';
    }
}

ajustarAlturaCarrusel();
window.addEventListener('resize', ajustarAlturaCarrusel);

// =====================================================
// FUNCIONES PARA REGISTRO/LOGIN
// =====================================================

function cambiarFormulario(tipo) {
    const formularioLogin = document.getElementById('formularioLogin');
    const formularioRegistro = document.getElementById('formularioRegistro');
    
    if (!formularioLogin || !formularioRegistro) return;
    
    if (tipo === 'registro') {
        formularioLogin.classList.add('oculto');
        formularioRegistro.classList.remove('oculto');
        formularioRegistro.style.animation = 'deslizarDesdeIzquierda 0.6s ease';
    } else {
        formularioRegistro.classList.add('oculto');
        formularioLogin.classList.remove('oculto');
        formularioLogin.style.animation = 'deslizarDesdeIzquierda 0.6s ease';
    }
}

function togglePassword(idInput) {
    const input = document.getElementById(idInput);
    if (!input) return;
    
    const boton = input.parentElement.querySelector('.ver-password');
    if (input.type === 'password') {
        input.type = 'text';
        if (boton) boton.textContent = '🙈';
    } else {
        input.type = 'password';
        if (boton) boton.textContent = '👁️';
    }
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function mostrarMensaje(mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = 'mensaje-toast ' + tipo;
    toast.innerHTML = '<span class="icono-mensaje">' + (tipo === 'exito' ? '✓' : '⚠') + '</span><span>' + mensaje + '</span>';
    
    if (!document.getElementById('estilos-toast')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-toast';
        estilos.textContent = '.mensaje-toast{position:fixed;top:100px;right:20px;padding:15px 25px;border-radius:10px;display:flex;align-items:center;gap:10px;font-weight:500;z-index:10000;animation:deslizarDesdeDerecha 0.5s ease;box-shadow:0 10px 30px rgba(0,0,0,0.3)}.mensaje-toast.exito{background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:white}.mensaje-toast.error{background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:white}.icono-mensaje{font-size:20px;font-weight:bold}@keyframes deslizarSalir{to{transform:translateX(400px);opacity:0}}';
        document.head.appendChild(estilos);
    }
    
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.animation = 'deslizarSalir 0.5s ease forwards';
        setTimeout(function() {
            toast.remove();
        }, 500);
    }, 4000);
}

// =====================================================
// VERIFICAR NOMBRE DE PERFIL
// =====================================================

let timeoutVerificacion = null;
const nombrePerfilInput = document.getElementById('regNombrePerfil');

if (nombrePerfilInput) {
    nombrePerfilInput.addEventListener('input', function() {
        const nombrePerfil = this.value.trim();
        const mensajeDiv = document.getElementById('mensajeDisponibilidad');
        
        clearTimeout(timeoutVerificacion);
        
        if (nombrePerfil.length < 3) {
            mensajeDiv.textContent = '';
            mensajeDiv.className = 'mensaje-disponibilidad';
            return;
        }
        
        mensajeDiv.textContent = 'Verificando...';
        mensajeDiv.className = 'mensaje-disponibilidad verificando';
        
        timeoutVerificacion = setTimeout(function() {
            fetch('/api/verificar-nombre-perfil', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_perfil: nombrePerfil })
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.disponible) {
                    mensajeDiv.textContent = '✓ ' + data.mensaje;
                    mensajeDiv.className = 'mensaje-disponibilidad disponible';
                    nombrePerfilInput.style.borderColor = '#10b981';
                } else {
                    mensajeDiv.textContent = '✗ ' + data.mensaje;
                    mensajeDiv.className = 'mensaje-disponibilidad no-disponible';
                    nombrePerfilInput.style.borderColor = '#ef4444';
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
                mensajeDiv.textContent = 'Error al verificar';
                mensajeDiv.className = 'mensaje-disponibilidad no-disponible';
            });
        }, 500);
    });
}

// =====================================================
// FORM LOGIN
// =====================================================

const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }
        
        const botonSubmit = this.querySelector('.boton-submit');
        botonSubmit.innerHTML = '<span>Iniciando sesión...</span>';
        botonSubmit.disabled = true;
        
        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                mostrarMensaje(data.mensaje, 'exito');
                setTimeout(function() { window.location.href = '/'; }, 1500);
            } else {
                mostrarMensaje(data.mensaje, 'error');
                botonSubmit.innerHTML = '<span>Iniciar Sesión</span><span class="icono-boton">→</span>';
                botonSubmit.disabled = false;
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            mostrarMensaje('Error al iniciar sesión', 'error');
            botonSubmit.innerHTML = '<span>Iniciar Sesión</span><span class="icono-boton">→</span>';
            botonSubmit.disabled = false;
        });
    });
}

// =====================================================
// FORM REGISTRO
// =====================================================

const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombrePerfil = document.getElementById('regNombrePerfil').value.trim();
        const nombre = document.getElementById('regNombre').value;
        const apellido = document.getElementById('regApellido').value;
        const email = document.getElementById('regEmail').value;
        const telefono = document.getElementById('regTelefono').value;
        const fechaNacimiento = document.getElementById('regFechaNacimiento').value;
        const genero = document.getElementById('regGenero').value;
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;
        const plan = document.getElementById('regPlan').value;
        const terminos = this.querySelector('input[name="terminos"]').checked;
        
        if (!nombrePerfil || !nombre || !apellido || !email || !telefono || !fechaNacimiento || !genero || !password || !passwordConfirm || !plan) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }
        
        if (nombrePerfil.length < 3) {
            mostrarMensaje('El nombre de perfil debe tener al menos 3 caracteres', 'error');
            return;
        }
        
        if (password !== passwordConfirm) {
            mostrarMensaje('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (password.length < 6) {
            mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        if (!terminos) {
            mostrarMensaje('Debes aceptar los términos y condiciones', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarMensaje('Por favor ingresa un email válido', 'error');
            return;
        }
        
        const edad = calcularEdad(fechaNacimiento);
        if (edad < 16) {
            mostrarMensaje('Debes ser mayor de 16 años para registrarte', 'error');
            return;
        }
        
        const botonSubmit = this.querySelector('.boton-submit');
        botonSubmit.innerHTML = '<span>Creando cuenta...</span>';
        botonSubmit.disabled = true;
        
        fetch('/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_perfil: nombrePerfil.toLowerCase(),
                nombre: nombre,
                apellido: apellido,
                email: email,
                telefono: telefono,
                fecha_nacimiento: fechaNacimiento,
                genero: genero,
                password: password,
                plan: plan
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                mostrarMensaje(data.mensaje, 'exito');
                setTimeout(function() { window.location.href = '/'; }, 2000);
            } else {
                mostrarMensaje(data.mensaje, 'error');
                botonSubmit.innerHTML = '<span>Crear Cuenta</span><span class="icono-boton">✓</span>';
                botonSubmit.disabled = false;
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            mostrarMensaje('Error al registrar usuario', 'error');
            botonSubmit.innerHTML = '<span>Crear Cuenta</span><span class="icono-boton">✓</span>';
            botonSubmit.disabled = false;
        });
    });
}

// =====================================================
// VALIDACIONES EN TIEMPO REAL
// =====================================================

if (formRegistro) {
    const emailInput = document.getElementById('regEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#ef4444';
            } else if (this.value) {
                this.style.borderColor = '#10b981';
            }
        });
        emailInput.addEventListener('focus', function() {
            this.style.borderColor = '#a855f7';
        });
    }
    
    const passwordInput = document.getElementById('regPassword');
    const passwordConfirmInput = document.getElementById('regPasswordConfirm');
    
    if (passwordConfirmInput && passwordInput) {
        passwordConfirmInput.addEventListener('input', function() {
            if (this.value && passwordInput.value !== this.value) {
                this.style.borderColor = '#ef4444';
            } else if (this.value && passwordInput.value === this.value) {
                this.style.borderColor = '#10b981';
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let fortaleza = 0;
            if (password.length >= 6) fortaleza++;
            if (password.length >= 10) fortaleza++;
            if (/[A-Z]/.test(password)) fortaleza++;
            if (/[0-9]/.test(password)) fortaleza++;
            if (/[^A-Za-z0-9]/.test(password)) fortaleza++;
            const colores = ['#ef4444', '#f59e0b', '#10b981'];
            const color = colores[Math.min(Math.max(fortaleza - 1, 0), 2)];
            if (password.length > 0) {
                this.style.borderColor = color;
            }
        });
    }
}

// =====================================================
// FORMATEAR TELÉFONO
// =====================================================

const telefonoInput = document.getElementById('regTelefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '');
        if (valor.length > 0) {
            if (!valor.startsWith('57')) {
                valor = '57' + valor;
            }
            let formatado = '+' + valor.substring(0, 2);
            if (valor.length > 2) formatado += ' ' + valor.substring(2, 5);
            if (valor.length > 5) formatado += ' ' + valor.substring(5, 8);
            if (valor.length > 8) formatado += ' ' + valor.substring(8, 12);
            this.value = formatado;
        }
    });
}

// =====================================================
// BOTONES SOCIALES
// =====================================================

const botonesSociales = document.querySelectorAll('.boton-social');
botonesSociales.forEach(function(boton) {
    boton.addEventListener('click', function() {
        const red = this.classList.contains('google') ? 'Google' : 'Facebook';
        mostrarMensaje('Función de ' + red + ' próximamente', 'exito');
    });
});

// =====================================================
// BOTONES DE PLANES
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const botonesPlan = document.querySelectorAll('.boton-plan');
    botonesPlan.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const tarjetaPlan = this.closest('.tarjeta-plan');
            if (!tarjetaPlan) return;
            const nombrePlan = tarjetaPlan.querySelector('.nombre-plan');
            if (!nombrePlan) return;
            const nombrePlanTexto = nombrePlan.textContent.toLowerCase();
            let plan = 'smart';
            if (nombrePlanTexto.includes('black')) plan = 'black';
            else if (nombrePlanTexto.includes('fit')) plan = 'fit';
            window.location.href = 'registro?plan=' + plan;
        });
    });
    
    const botonesLlamada = document.querySelectorAll('.boton-llamada-accion');
    botonesLlamada.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'registro';
        });
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const planSeleccionado = urlParams.get('plan');
    if (planSeleccionado) {
        cambiarFormulario('registro');
        const selectPlan = document.getElementById('regPlan');
        if (selectPlan) {
            selectPlan.value = planSeleccionado;
            selectPlan.style.animation = 'pulso 1s ease';
            selectPlan.style.borderColor = '#fbbf24';
            setTimeout(function() {
                selectPlan.style.borderColor = '';
            }, 2000);
        }
        const planNombres = { 'smart': 'Plan Smart', 'fit': 'Plan Fit', 'black': 'Plan Black' };
        if (planNombres[planSeleccionado]) {
            setTimeout(function() {
                mostrarMensaje('Has seleccionado el ' + planNombres[planSeleccionado] + '. ¡Completa tu registro! 🎉', 'exito');
            }, 500);
        }
    }
});

console.log('✅ Power Core Gym cargado correctamente');

/* =====================================================
   FUNCIONALIDAD DE PERFIL DE USUARIO
   AGREGAR AL FINAL DE script.js (antes del console.log final)
   ===================================================== */

// Variable global para el usuario
let usuarioActual = null;

// =====================================================
// VERIFICAR SESIÓN AL CARGAR
// =====================================================

window.addEventListener('DOMContentLoaded', function() {
    fetch('/api/usuario-actual')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.logueado) {
                usuarioActual = data.usuario;
                mostrarUsuarioEnNav();
            }
        })
        .catch(function(error) {
            console.error('Error al verificar sesión:', error);
        });
});

// =====================================================
// MOSTRAR USUARIO EN NAVEGACIÓN
// =====================================================

function mostrarUsuarioEnNav() {
    const navegacion = document.getElementById('barra-navegacion');
    if (!navegacion) return;
    
    // Buscar el contenedor de botones o el botón individual
    const botonesAuth = document.getElementById('botonesAuth');
    const botonInscribete = navegacion.querySelector('.boton-inscribete');
    const botonIniciar = navegacion.querySelector('.boton-iniciar-sesion');
    
    // Crear botón de usuario
    const botonUsuario = document.createElement('button');
    botonUsuario.className = 'boton-usuario-nav';
    botonUsuario.innerHTML = '<img src="' + (usuarioActual.foto_perfil || 'https://ui-avatars.com/api/?name=' + usuarioActual.nombre_perfil + '&background=a855f7&color=fff') + '" alt="Foto"><span>@' + usuarioActual.nombre_perfil + '</span>';
    botonUsuario.onclick = toggleMenuUsuario;
    
    // Reemplazar lo que exista
    if (botonesAuth) {
        botonesAuth.replaceWith(botonUsuario);
    } else if (botonInscribete) {
        botonInscribete.replaceWith(botonUsuario);
    } else if (botonIniciar) {
        botonIniciar.replaceWith(botonUsuario);
    } else {
        // Si no encuentra nada, agregarlo al final de la navegación
        navegacion.appendChild(botonUsuario);
    }
}

// =====================================================
// TOGGLE MENÚ USUARIO
// =====================================================

function toggleMenuUsuario() {
    let menu = document.getElementById('menuUsuario');
    
    if (!menu) {
        menu = crearMenuUsuario();
        document.body.appendChild(menu);
    }
    
    menu.classList.toggle('oculto');
    
    if (!menu.classList.contains('oculto')) {
        actualizarInfoMenuUsuario();
    }
}

function crearMenuUsuario() {
    const menu = document.createElement('div');
    menu.id = 'menuUsuario';
    menu.className = 'menu-usuario oculto';
    menu.innerHTML = '<div class="info-usuario"><img id="fotoUsuario" src="" alt="Foto" class="foto-perfil-menu"><div><h3 id="nombreUsuario"></h3><p id="planUsuario"></p></div></div><div class="opciones-usuario"><button onclick="abrirModalPerfil()" class="opcion-usuario">👤 Mi Perfil</button><button onclick="abrirModalPassword()" class="opcion-usuario">🔒 Cambiar Contraseña</button><button onclick="cerrarSesion()" class="opcion-usuario salir">🚪 Cerrar Sesión</button></div>';
    return menu;
}

function actualizarInfoMenuUsuario() {
    document.getElementById('fotoUsuario').src = usuarioActual.foto_perfil || 'https://ui-avatars.com/api/?name=' + usuarioActual.nombre_perfil + '&background=a855f7&color=fff';
    document.getElementById('nombreUsuario').textContent = '@' + usuarioActual.nombre_perfil;
    document.getElementById('planUsuario').textContent = 'Plan ' + usuarioActual.plan.charAt(0).toUpperCase() + usuarioActual.plan.slice(1);
}

// =====================================================
// MODAL DE PERFIL
// =====================================================

function abrirModalPerfil() {
    let modal = document.getElementById('modalPerfil');
    if (!modal) {
        modal = crearModalPerfil();
        document.body.appendChild(modal);
    }
    
    document.getElementById('fotoPerfil').src = usuarioActual.foto_perfil || 'https://ui-avatars.com/api/?name=' + usuarioActual.nombre_perfil + '&background=a855f7&color=fff';
    document.getElementById('perfilNombreUsuario').textContent = '@' + usuarioActual.nombre_perfil;
    document.getElementById('perfilNombreCompleto').textContent = usuarioActual.nombre + ' ' + usuarioActual.apellido;
    document.getElementById('perfilEmail').textContent = usuarioActual.email;
    document.getElementById('perfilPlan').textContent = 'Plan ' + usuarioActual.plan.charAt(0).toUpperCase() + usuarioActual.plan.slice(1);
    
    modal.classList.remove('oculto');
    document.getElementById('menuUsuario').classList.add('oculto');
}

function crearModalPerfil() {
    const modal = document.createElement('div');
    modal.id = 'modalPerfil';
    modal.className = 'modal-overlay oculto';
    modal.innerHTML = '<div class="modal-contenido"><button class="cerrar-modal" onclick="cerrarModalPerfil()">✕</button><h2>Mi Perfil</h2><div class="perfil-foto-container"><img id="fotoPerfil" src="" alt="Foto" class="foto-perfil-grande"><button onclick="cambiarFoto()" class="boton-cambiar-foto">Cambiar Foto</button></div><div class="perfil-info"><p><strong>Nombre de Usuario:</strong> <span id="perfilNombreUsuario"></span></p><p><strong>Nombre Completo:</strong> <span id="perfilNombreCompleto"></span></p><p><strong>Email:</strong> <span id="perfilEmail"></span></p><p><strong>Plan:</strong> <span id="perfilPlan"></span></p></div></div>';
    return modal;
}

function cerrarModalPerfil() {
    document.getElementById('modalPerfil').classList.add('oculto');
}

// =====================================================
// CAMBIAR FOTO
// =====================================================

function cambiarFoto() {
    const nuevaFoto = prompt('Ingresa la URL de tu nueva foto de perfil:', usuarioActual.foto_perfil);
    
    if (!nuevaFoto) return;
    
    fetch('/api/actualizar-foto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foto_url: nuevaFoto })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.success) {
            usuarioActual.foto_perfil = data.foto_url;
            document.getElementById('fotoPerfil').src = data.foto_url;
            document.getElementById('fotoUsuario').src = data.foto_url;
            document.querySelector('.boton-usuario-nav img').src = data.foto_url;
            mostrarMensaje('Foto actualizada correctamente', 'exito');
        } else {
            mostrarMensaje(data.mensaje, 'error');
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        mostrarMensaje('Error al actualizar foto', 'error');
    });
}

// =====================================================
// MODAL DE CAMBIAR CONTRASEÑA
// =====================================================

function abrirModalPassword() {
    let modal = document.getElementById('modalPassword');
    if (!modal) {
        modal = crearModalPassword();
        document.body.appendChild(modal);
        
        document.getElementById('formCambiarPassword').addEventListener('submit', cambiarPassword);
    }
    
    modal.classList.remove('oculto');
    document.getElementById('menuUsuario').classList.add('oculto');
}

function crearModalPassword() {
    const modal = document.createElement('div');
    modal.id = 'modalPassword';
    modal.className = 'modal-overlay oculto';
    modal.innerHTML = '<div class="modal-contenido"><button class="cerrar-modal" onclick="cerrarModalPassword()">✕</button><h2>Cambiar Contraseña</h2><form id="formCambiarPassword"><div class="grupo-input"><label>Contraseña Actual</label><input type="password" id="passwordActual" required></div><div class="grupo-input"><label>Nueva Contraseña</label><input type="password" id="passwordNueva" required></div><div class="grupo-input"><label>Confirmar Nueva Contraseña</label><input type="password" id="passwordConfirmar" required></div><button type="submit" class="boton-submit">Actualizar Contraseña</button></form></div>';
    return modal;
}

function cerrarModalPassword() {
    document.getElementById('modalPassword').classList.add('oculto');
    document.getElementById('formCambiarPassword').reset();
}

function cambiarPassword(e) {
    e.preventDefault();
    
    const passwordActual = document.getElementById('passwordActual').value;
    const passwordNueva = document.getElementById('passwordNueva').value;
    const passwordConfirmar = document.getElementById('passwordConfirmar').value;
    
    if (passwordNueva !== passwordConfirmar) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (passwordNueva.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    fetch('/api/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password_actual: passwordActual,
            password_nueva: passwordNueva,
            password_confirmar: passwordConfirmar
        })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.success) {
            mostrarMensaje(data.mensaje, 'exito');
            cerrarModalPassword();
        } else {
            mostrarMensaje(data.mensaje, 'error');
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cambiar contraseña', 'error');
    });
}

// =====================================================
// CERRAR SESIÓN
// =====================================================

function cerrarSesion() {
    if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) return;
    
    fetch('/api/logout', {
        method: 'POST'
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        mostrarMensaje('Sesión cerrada correctamente', 'exito');
        setTimeout(function() {
            window.location.href = '/';
        }, 1500);
    })
    .catch(function(error) {
        console.error('Error:', error);
        window.location.href = '/';
    });
}

// =====================================================
// CERRAR MENÚ AL HACER CLICK FUERA
// =====================================================

document.addEventListener('click', function(e) {
    const menu = document.getElementById('menuUsuario');
    const botonUsuario = document.querySelector('.boton-usuario-nav');
    
    if (menu && !menu.contains(e.target) && botonUsuario && !botonUsuario.contains(e.target)) {
        menu.classList.add('oculto');
    }

    

    /* =====================================================
   CÓDIGO KONAMI Y CUPONES SECRETOS
   AGREGAR AL FINAL DE script.js
   ===================================================== */

let codigoKonami = [];
const secuenciaKonami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let cuponesActivados = false;

document.addEventListener('keydown', function(e) {
    codigoKonami.push(e.keyCode);
    codigoKonami = codigoKonami.slice(-10);
    
    if (codigoKonami.join(',') === secuenciaKonami.join(',')) {
        if (!cuponesActivados) {
            activarCupones();
            cuponesActivados = true;
        }
    }
});

function activarCupones() {
    document.body.style.animation = 'pulso 0.5s ease-in-out';
    
    setTimeout(function() {
        document.body.style.animation = '';
        mostrarModalCupones();
    }, 500);
    
    crearConfetti();
}

function mostrarModalCupones() {
    let modal = document.getElementById('modalCupones');
    
    if (!modal) {
        modal = crearModalCupones();
        document.body.appendChild(modal);
    }
    
    modal.classList.remove('oculto');
}

function crearModalCupones() {
    const modal = document.createElement('div');
    modal.id = 'modalCupones';
    modal.className = 'modal-cupones oculto';
    modal.innerHTML = `
        <div class="contenido-cupones">
            <button class="cerrar-cupones" onclick="cerrarCupones()">✕</button>
            <div class="titulo-cupones">
                <h2>🎉 ¡CUPONES SECRETOS! 🎉</h2>
                <p>Has desbloqueado promociones exclusivas. ¡Usa estos códigos!</p>
            </div>
            <div class="lista-cupones">
                <div class="tarjeta-cupon">
                    <span class="etiqueta-cupon">EXCLUSIVO</span>
                    <h3 class="titulo-cupon">Plan Black Gratis</h3>
                    <div class="descuento-grande">1 MES</div>
                    <p class="descripcion-cupon">
                        Disfruta de un mes completo del Plan Black totalmente GRATIS. 
                        Acceso 24/7 a todas las instalaciones.
                    </p>
                    <div class="codigo-cupon" onclick="copiarCodigo('POWERCORE2025')">
                        <span>POWERCORE2025</span>
                        <small>Click para copiar</small>
                    </div>
                    <p class="validez-cupon">Válido hasta: 31/12/2025</p>
                </div>

                <div class="tarjeta-cupon">
                    <span class="etiqueta-cupon">SUPER OFERTA</span>
                    <h3 class="titulo-cupon">Descuento Mega</h3>
                    <div class="descuento-grande">50%</div>
                    <p class="descripcion-cupon">
                        50% de descuento en cualquier plan por 3 meses. 
                        Aplica para nuevos miembros.
                    </p>
                    <div class="codigo-cupon" onclick="copiarCodigo('KONAMI50')">
                        <span>KONAMI50</span>
                        <small>Click para copiar</small>
                    </div>
                    <p class="validez-cupon">Válido hasta: 31/03/2026</p>
                </div>

                <div class="tarjeta-cupon">
                    <span class="etiqueta-cupon">VIP</span>
                    <h3 class="titulo-cupon">Entrenador Personal</h3>
                    <div class="descuento-grande">5 🎁</div>
                    <p class="descripcion-cupon">
                        5 sesiones GRATIS con entrenador personal certificado. 
                        Personaliza tu rutina.
                    </p>
                    <div class="codigo-cupon" onclick="copiarCodigo('TRAINER5')">
                        <span>TRAINER5</span>
                        <small>Click para copiar</small>
                    </div>
                    <p class="validez-cupon">Válido hasta: 30/06/2026</p>
                </div>

                <div class="tarjeta-cupon">
                    <span class="etiqueta-cupon">AMIGOS</span>
                    <h3 class="titulo-cupon">Trae un Amigo</h3>
                    <div class="descuento-grande">2x1</div>
                    <p class="descripcion-cupon">
                        Invita a un amigo y ambos obtienen 2 meses al precio de 1. 
                        ¡Entrena en compañía!
                    </p>
                    <div class="codigo-cupon" onclick="copiarCodigo('AMIGO2X1')">
                        <span>AMIGO2X1</span>
                        <small>Click para copiar</small>
                    </div>
                    <p class="validez-cupon">Válido hasta: 31/12/2025</p>
                </div>

                <div class="tarjeta-cupon">
                    <span class="etiqueta-cupon">FITNESS</span>
                    <h3 class="titulo-cupon">Kit Deportivo</h3>
                    <div class="descuento-grande">GRATIS</div>
                    <p class="descripcion-cupon">
                        Kit completo: botella, toalla y guantes. 
                        Regalo por inscripción.
                    </p>
                    <div class="codigo-cupon" onclick="copiarCodigo('KITGRATIS')">
                        <span>KITGRATIS</span>
                        <small>Click para copiar</small>
                    </div>
                    <p class="validez-cupon">Válido hasta: 31/05/2026</p>
                </div>

                <div class="tarjeta-cupon">
                    <span class="etiqueta-cupon">PREMIUM</span>
                    <h3 class="titulo-cupon">Acceso Ilimitado</h3>
                    <div class="descuento-grande">6 MESES</div>
                    <p class="descripcion-cupon">
                        Acceso ilimitado por 6 meses al precio de 4. 
                        Todas las clases incluidas.
                    </p>
                    <div class="codigo-cupon" onclick="copiarCodigo('ULTRA6')">
                        <span>ULTRA6</span>
                        <small>Click para copiar</small>
                    </div>
                    <p class="validez-cupon">Válido hasta: 31/12/2026</p>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function cerrarCupones() {
    const modal = document.getElementById('modalCupones');
    if (modal) {
        modal.classList.add('oculto');
    }
}

function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo).then(function() {
        mostrarMensaje('✓ Código ' + codigo + ' copiado al portapapeles', 'exito');
    }).catch(function() {
        const input = document.createElement('input');
        input.value = codigo;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        mostrarMensaje('✓ Código copiado: ' + codigo, 'exito');
    });
}

function crearConfetti() {
    const colores = ['#a855f7', '#fbbf24', '#ef4444', '#10b981', '#3b82f6'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(function() {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colores[Math.floor(Math.random() * colores.length)];
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            let posY = -10;
            let velocidad = 2 + Math.random() * 3;
            
            const intervalo = setInterval(function() {
                posY += velocidad;
                confetti.style.top = posY + 'px';
                
                if (posY > window.innerHeight) {
                    clearInterval(intervalo);
                    confetti.remove();
                }
            }, 20);
        }, i * 30);
    }
}

console.log('🎮 Código Konami activado. Presiona: ↑↑↓↓←→←→BA');
});

