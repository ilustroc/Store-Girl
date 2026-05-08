// ========================================
// SISTEMA DE AUTENTICACIÓN Y MODALES
// Archivo: auth.js
// ========================================

// ==========================================
// GESTOR DE USUARIOS
// ==========================================

class GestorDeUsuarios {
    constructor() {
        // Usuario maestro predefinido
        this.usuarioMaestro = {
            email: 'admin@gmail.com',
            contraseña: 'admin',
            nombre: 'Administrador',
            rol: 'admin',
            fechaRegistro: new Date().toISOString()
        };
        
        this.inicializarSistema();
    }

    // Inicializar el sistema de usuarios
    inicializarSistema() {
        if (!localStorage.getItem('usuarios')) {
            localStorage.setItem('usuarios', JSON.stringify([this.usuarioMaestro]));
        }
    }

    // Obtener todos los usuarios
    obtenerUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios')) || [this.usuarioMaestro];
    }

    // Guardar usuarios
    guardarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // Registrar nuevo usuario
    registrarUsuario(datos) {
        const usuarios = this.obtenerUsuarios();
        
        // Validar que el email no exista
        if (usuarios.find(u => u.email === datos.email)) {
            return { exito: false, mensaje: 'Este correo electrónico ya está registrado' };
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
            email: datos.email,
            contraseña: datos.contraseña,
            nombre: datos.nombre,
            telefono: datos.telefono || '',
            rol: 'usuario',
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(nuevoUsuario);
        this.guardarUsuarios(usuarios);

        return { exito: true, mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario };
    }

    // Iniciar sesión
    iniciarSesion(email, contraseña) {
        const usuarios = this.obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);

        if (usuario) {
            // Guardar sesión activa
            const sesion = {
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
                fechaInicio: new Date().toISOString()
            };
            localStorage.setItem('sesionActiva', JSON.stringify(sesion));
            return { exito: true, mensaje: '¡Bienvenido!', usuario };
        }

        return { exito: false, mensaje: 'Email o contraseña incorrectos' };
    }

    // Cerrar sesión
    cerrarSesion() {
        localStorage.removeItem('sesionActiva');
    }

    // Obtener sesión activa
    obtenerSesionActiva() {
        const sesion = localStorage.getItem('sesionActiva');
        return sesion ? JSON.parse(sesion) : null;
    }

    // Verificar si hay sesión activa
    haySesionActiva() {
        return this.obtenerSesionActiva() !== null;
    }

    // Generar código de recuperación de 5 dígitos
    generarCodigoRecuperacion() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Recuperar contraseña - Generar código de recuperación
    recuperarContraseña(email) {
        const usuarios = this.obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (usuario) {
            // Generar código de 5 dígitos
            const codigoRecuperacion = this.generarCodigoRecuperacion();
            
            // Guardar código temporalmente en localStorage
            const codigosRecuperacion = JSON.parse(localStorage.getItem('codigosRecuperacion')) || {};
            codigosRecuperacion[email] = {
                codigo: codigoRecuperacion,
                expiracion: Date.now() + (15 * 60 * 1000) // 15 minutos
            };
            localStorage.setItem('codigosRecuperacion', JSON.stringify(codigosRecuperacion));
            
            return { 
                exito: true, 
                mensaje: 'Se ha enviado un código de recuperación a tu correo electrónico',
                codigo: codigoRecuperacion // En producción esto NO se retornaría, se enviaría por email
            };
        }

        return { exito: false, mensaje: 'No existe una cuenta con ese correo electrónico' };
    }

    // Verificar código de recuperación y cambiar contraseña
    restablecerContraseña(email, codigo, nuevaContraseña) {
        const codigosRecuperacion = JSON.parse(localStorage.getItem('codigosRecuperacion')) || {};
        const recuperacion = codigosRecuperacion[email];

        // Verificar si existe código y no ha expirado
        if (!recuperacion) {
            return { exito: false, mensaje: 'No hay solicitud de recuperación para este correo' };
        }

        if (Date.now() > recuperacion.expiracion) {
            delete codigosRecuperacion[email];
            localStorage.setItem('codigosRecuperacion', JSON.stringify(codigosRecuperacion));
            return { exito: false, mensaje: 'El código ha expirado. Solicita uno nuevo' };
        }

        if (recuperacion.codigo !== codigo) {
            return { exito: false, mensaje: 'Código incorrecto' };
        }

        // Código válido - cambiar contraseña
        const usuarios = this.obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (usuario) {
            usuario.contraseña = nuevaContraseña;
            this.guardarUsuarios(usuarios);

            // Eliminar código usado
            delete codigosRecuperacion[email];
            localStorage.setItem('codigosRecuperacion', JSON.stringify(codigosRecuperacion));

            return { exito: true, mensaje: 'Contraseña actualizada correctamente' };
        }

        return { exito: false, mensaje: 'Error al actualizar la contraseña' };
    }
}

// ==========================================
// GESTOR DE MODALES
// ==========================================

class GestorDeModales {
    constructor() {
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalContainer = document.getElementById('modal-container');
        this.modalTitulo = document.getElementById('modal-titulo');
        this.modalBody = document.getElementById('modal-body');
        this.modalFooter = document.getElementById('modal-footer');
        this.modalClose = document.getElementById('modal-close');

        this.configurarEventos();
    }

    // Configurar eventos del modal
    configurarEventos() {
        // Cerrar modal al hacer clic en X
        this.modalClose.addEventListener('click', () => this.cerrarModal());

        // Cerrar modal al hacer clic fuera
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.cerrarModal();
            }
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                this.cerrarModal();
            }
        });
    }

    // Abrir modal
    abrirModal() {
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    cerrarModal() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Limpiar contenido después de la animación
        setTimeout(() => {
            this.modalBody.innerHTML = '';
            this.modalFooter.innerHTML = '';
        }, 300);
    }

    // Modal genérico de información
    mostrarInfo(titulo, mensaje, tipo = 'info') {
        this.modalTitulo.textContent = titulo;
        
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        this.modalBody.innerHTML = `
            <div class="modal-message ${tipo}">
                <i class="fas ${iconos[tipo]} fa-2x"></i>
                <p style="margin: 0;">${mensaje}</p>
            </div>
        `;

        this.modalFooter.innerHTML = `
            <button class="btn-modal btn-modal-primary" onclick="gestorModales.cerrarModal()">
                Aceptar
            </button>
        `;

        this.abrirModal();
    }

    // Modal de confirmación
    mostrarConfirmacion(titulo, mensaje, onConfirmar) {
        this.modalTitulo.textContent = titulo;
        
        this.modalBody.innerHTML = `
            <div class="modal-message warning">
                <i class="fas fa-question-circle fa-2x"></i>
                <p style="margin: 0;">${mensaje}</p>
            </div>
        `;

        this.modalFooter.innerHTML = `
            <button class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal()">
                Cancelar
            </button>
            <button class="btn-modal btn-modal-primary" id="btn-confirmar">
                Confirmar
            </button>
        `;

        this.abrirModal();

        // Asignar evento al botón confirmar
        document.getElementById('btn-confirmar').addEventListener('click', () => {
            onConfirmar();
            this.cerrarModal();
        });
    }

    // Modal de Login
    mostrarLogin() {
        this.modalTitulo.textContent = 'Iniciar Sesión';
        
        this.modalBody.innerHTML = `
            <form id="form-login">
                <div class="form-group">
                    <label for="login-email">Correo Electrónico</label>
                    <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="login-email" placeholder="ejemplo@correo.com" required>
                    </div>
                    <span class="error-message" id="error-login-email"></span>
                </div>

                <div class="form-group">
                    <label for="login-contraseña">Contraseña</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="login-contraseña" placeholder="••••••••" required>
                    </div>
                    <span class="error-message" id="error-login-contraseña"></span>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="recordar-sesion">
                    <label for="recordar-sesion">Recordar sesión</label>
                </div>

                <div class="text-center" style="margin-top: 15px;">
                    <a class="modal-link" onclick="gestorModales.mostrarRecuperarContraseña()">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                <div class="modal-divider"></div>

                <p class="text-center">
                    ¿No tienes cuenta? 
                    <a class="modal-link" onclick="gestorModales.mostrarRegistro()">Regístrate aquí</a>
                </p>
            </form>
        `;

        this.modalFooter.innerHTML = `
            <button type="button" class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal()">
                Cancelar
            </button>
            <button type="submit" form="form-login" class="btn-modal btn-modal-primary">
                <i class="fas fa-sign-in-alt"></i> Ingresar
            </button>
        `;

        this.abrirModal();

        // Manejar submit del formulario
        document.getElementById('form-login').addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarLogin();
        });
    }

    // Procesar login
    procesarLogin() {
        const email = document.getElementById('login-email').value.trim();
        const contraseña = document.getElementById('login-contraseña').value;

        const resultado = gestorUsuarios.iniciarSesion(email, contraseña);

        if (resultado.exito) {
            // Primero cerrar el modal de login
            this.cerrarModal();
            
            // Actualizar la interfaz
            actualizarInterfazUsuario();
            
            // Luego mostrar mensaje de bienvenida después de que cierre el modal de login
            setTimeout(() => {
                this.mostrarInfo(
                    '¡Bienvenido!', 
                    `Hola ${resultado.usuario.nombre}, has iniciado sesión correctamente.`, 
                    'success'
                );
            }, 400);
        } else {
            this.mostrarInfo('Error', resultado.mensaje, 'error');
        }
    }

    // Modal de Registro
    mostrarRegistro() {
        this.modalTitulo.textContent = 'Crear Cuenta';
        
        this.modalBody.innerHTML = `
            <form id="form-registro">
                <div class="form-group">
                    <label for="registro-nombre">Nombre Completo</label>
                    <div class="input-with-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="registro-nombre" placeholder="Juan Pérez" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="registro-email">Correo Electrónico</label>
                    <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="registro-email" placeholder="ejemplo@correo.com" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="registro-telefono">Teléfono (Opcional)</label>
                    <div class="input-with-icon">
                        <i class="fas fa-phone"></i>
                        <input type="tel" id="registro-telefono" placeholder="+51 999 999 999">
                    </div>
                </div>

                <div class="form-group">
                    <label for="registro-contraseña">Contraseña</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="registro-contraseña" placeholder="••••••••" required minlength="4">
                    </div>
                    <span class="helper-text">Mínimo 4 caracteres</span>
                </div>

                <div class="form-group">
                    <label for="registro-confirmar-contraseña">Confirmar Contraseña</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="registro-confirmar-contraseña" placeholder="••••••••" required>
                    </div>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="aceptar-terminos" required>
                    <label for="aceptar-terminos">Acepto los términos y condiciones</label>
                </div>

                <div class="modal-divider"></div>

                <p class="text-center">
                    ¿Ya tienes cuenta? 
                    <a class="modal-link" onclick="gestorModales.mostrarLogin()">Inicia sesión aquí</a>
                </p>
            </form>
        `;

        this.modalFooter.innerHTML = `
            <button type="button" class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal()">
                Cancelar
            </button>
            <button type="submit" form="form-registro" class="btn-modal btn-modal-success">
                <i class="fas fa-user-plus"></i> Registrarse
            </button>
        `;

        this.abrirModal();

        // Manejar submit del formulario
        document.getElementById('form-registro').addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRegistro();
        });
    }

    // Procesar registro
    procesarRegistro() {
        const nombre = document.getElementById('registro-nombre').value.trim();
        const email = document.getElementById('registro-email').value.trim();
        const telefono = document.getElementById('registro-telefono').value.trim();
        const contraseña = document.getElementById('registro-contraseña').value;
        const confirmarContraseña = document.getElementById('registro-confirmar-contraseña').value;

        // Validar que las contraseñas coincidan
        if (contraseña !== confirmarContraseña) {
            this.mostrarInfo('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }

        const resultado = gestorUsuarios.registrarUsuario({
            nombre,
            email,
            telefono,
            contraseña
        });

        if (resultado.exito) {
            this.cerrarModal();
            setTimeout(() => {
                this.mostrarInfo('¡Registro Exitoso!', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.', 'success');
            }, 400);
        } else {
            this.mostrarInfo('Error', resultado.mensaje, 'error');
        }
    }

    // Modal de Recuperar Contraseña - Paso 1: Solicitar código
    mostrarRecuperarContraseña() {
        this.modalTitulo.textContent = 'Recuperar Contraseña';
        
        this.modalBody.innerHTML = `
            <div class="modal-message info">
                <i class="fas fa-info-circle"></i>
                <p style="margin: 0;">Ingresa tu correo electrónico y recibirás un código de recuperación de 5 dígitos.</p>
            </div>

            <form id="form-recuperar">
                <div class="form-group">
                    <label for="recuperar-email">Correo Electrónico</label>
                    <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="recuperar-email" placeholder="ejemplo@correo.com" required>
                    </div>
                </div>
            </form>

            <div class="modal-divider"></div>

            <p class="text-center">
                <a class="modal-link" onclick="gestorModales.mostrarLogin()">Volver al inicio de sesión</a>
            </p>
        `;

        this.modalFooter.innerHTML = `
            <button type="button" class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal()">
                Cancelar
            </button>
            <button type="submit" form="form-recuperar" class="btn-modal btn-modal-primary">
                <i class="fas fa-paper-plane"></i> Enviar Código
            </button>
        `;

        this.abrirModal();

        // Manejar submit del formulario
        document.getElementById('form-recuperar').addEventListener('submit', (e) => {
            e.preventDefault();
            this.solicitarCodigoRecuperacion();
        });
    }

    // Solicitar código de recuperación
    solicitarCodigoRecuperacion() {
        const email = document.getElementById('recuperar-email').value.trim();
        const resultado = gestorUsuarios.recuperarContraseña(email);

        if (resultado.exito) {
            // Guardar email temporalmente
            this.emailRecuperacion = email;
            
            // Mostrar el código (en producción esto se enviaría por email)
            this.cerrarModal();
            setTimeout(() => {
                this.mostrarInfo(
                    'Código Enviado', 
                    `Se ha enviado un código de recuperación a tu correo.<br><br><strong>(Demo)</strong> Tu código es: <strong style="font-size: 1.5em; color: #667eea;">${resultado.codigo}</strong><br><small>Este código expira en 15 minutos</small>`,
                    'success'
                );
                
                // Después de cerrar el mensaje, mostrar formulario de restablecer
                setTimeout(() => {
                    this.mostrarFormularioRestablecer(email);
                }, 2000);
            }, 400);
        } else {
            this.mostrarInfo('Error', resultado.mensaje, 'error');
        }
    }

    // Modal de Restablecer Contraseña - Paso 2: Ingresar código y nueva contraseña
    mostrarFormularioRestablecer(email) {
        this.modalTitulo.textContent = 'Restablecer Contraseña';
        
        this.modalBody.innerHTML = `
            <div class="modal-message info">
                <i class="fas fa-key"></i>
                <p style="margin: 0;">Ingresa el código de 5 dígitos que recibiste y tu nueva contraseña.</p>
            </div>

            <form id="form-restablecer">
                <input type="hidden" id="restablecer-email" value="${email}">
                
                <div class="form-group">
                    <label for="codigo-recuperacion">Código de Recuperación</label>
                    <div class="input-with-icon">
                        <i class="fas fa-shield-alt"></i>
                        <input type="text" id="codigo-recuperacion" placeholder="12345" required maxlength="5" pattern="[0-9]{5}">
                    </div>
                    <span class="helper-text">5 dígitos numéricos</span>
                </div>

                <div class="modal-divider"></div>

                <div class="form-group">
                    <label for="nueva-contraseña">Nueva Contraseña</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="nueva-contraseña" placeholder="••••••••" required minlength="4">
                    </div>
                    <span class="helper-text">Mínimo 4 caracteres</span>
                </div>

                <div class="form-group">
                    <label for="confirmar-nueva-contraseña">Confirmar Nueva Contraseña</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="confirmar-nueva-contraseña" placeholder="••••••••" required>
                    </div>
                </div>
            </form>

            <div class="modal-divider"></div>

            <p class="text-center">
                <a class="modal-link" onclick="gestorModales.mostrarRecuperarContraseña()">Solicitar nuevo código</a>
            </p>
        `;

        this.modalFooter.innerHTML = `
            <button type="button" class="btn-modal btn-modal-secondary" onclick="gestorModales.cerrarModal()">
                Cancelar
            </button>
            <button type="submit" form="form-restablecer" class="btn-modal btn-modal-success">
                <i class="fas fa-check"></i> Restablecer Contraseña
            </button>
        `;

        this.abrirModal();

        // Manejar submit del formulario
        document.getElementById('form-restablecer').addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRestablecimiento();
        });
    }

    // Procesar restablecimiento de contraseña
    procesarRestablecimiento() {
        const email = document.getElementById('restablecer-email').value;
        const codigo = document.getElementById('codigo-recuperacion').value.trim();
        const nuevaContraseña = document.getElementById('nueva-contraseña').value;
        const confirmarContraseña = document.getElementById('confirmar-nueva-contraseña').value;

        // Validar que las contraseñas coincidan
        if (nuevaContraseña !== confirmarContraseña) {
            this.mostrarInfo('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }

        // Validar código y restablecer contraseña
        const resultado = gestorUsuarios.restablecerContraseña(email, codigo, nuevaContraseña);

        if (resultado.exito) {
            this.cerrarModal();
            setTimeout(() => {
                this.mostrarInfo(
                    '¡Contraseña Actualizada!', 
                    'Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.', 
                    'success'
                );
            }, 400);
        } else {
            this.mostrarInfo('Error', resultado.mensaje, 'error');
        }
    }

    // Modal de Mis Pedidos
    mostrarMisPedidos() {
        const sesion = gestorUsuarios.obtenerSesionActiva();
        if (!sesion) {
            this.mostrarInfo('Error', 'Debes iniciar sesión para ver tus pedidos', 'error');
            return;
        }

        // Obtener pedidos del usuario
        const todosPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidosUsuario = todosPedidos.filter(p => p.cliente.email === sesion.email);

        this.modalTitulo.textContent = '📦 Mis Pedidos';
        this.modalContainer.classList.add('modal-ancho');

        if (pedidosUsuario.length === 0) {
            this.modalBody.innerHTML = `
                <div class="modal-message info">
                    <i class="fas fa-shopping-bag fa-3x"></i>
                    <div>
                        <h3>No tienes pedidos aún</h3>
                        <p>Cuando realices una compra, aparecerá aquí.</p>
                    </div>
                </div>
            `;
            this.modalFooter.innerHTML = `
                <button class="btn-modal btn-modal-primary" onclick="gestorModales.cerrarModal(); gestorModales.modalContainer.classList.remove('modal-ancho')">
                    Cerrar
                </button>
            `;
        } else {
            let tablaHTML = `
                <div class="info-usuario-compra">
                    <h4><i class="fas fa-user"></i> ${sesion.nombre}</h4>
                    <p><i class="fas fa-shopping-bag"></i> Total de pedidos: <strong>${pedidosUsuario.length}</strong></p>
                </div>

                <div class="tabla-resumen-compra">
                    <table id="tabla-mis-pedidos" class="display" style="width:100%">
                        <thead>
                            <tr>
                                <th>N° Pedido</th>
                                <th>Fecha</th>
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            pedidosUsuario.reverse().forEach(pedido => {
                const fecha = new Date(pedido.fecha).toLocaleDateString('es-PE');
                const cantidadProductos = pedido.productos.reduce((sum, p) => sum + p.cantidad, 0);
                
                tablaHTML += `
                    <tr>
                        <td><strong>${pedido.numeroPedido}</strong></td>
                        <td>${fecha}</td>
                        <td style="text-align: center;">${cantidadProductos} ${cantidadProductos === 1 ? 'producto' : 'productos'}</td>
                        <td class="producto-subtotal">S/${pedido.total.toLocaleString()}</td>
                        <td><span class="badge-estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span></td>
                    </tr>
                `;
            });

            tablaHTML += `
                        </tbody>
                    </table>
                </div>
            `;

            this.modalBody.innerHTML = tablaHTML;
            this.modalFooter.innerHTML = `
                <button class="btn-modal btn-modal-primary" onclick="gestorModales.cerrarModal(); gestorModales.modalContainer.classList.remove('modal-ancho')">
                    Cerrar
                </button>
            `;
        }

        this.abrirModal();

        // Inicializar DataTable
        if (pedidosUsuario.length > 0) {
            setTimeout(() => {
                if ($.fn.DataTable.isDataTable('#tabla-mis-pedidos')) {
                    $('#tabla-mis-pedidos').DataTable().destroy();
                }
                
                $('#tabla-mis-pedidos').DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                    },
                    pageLength: 10,
                    order: [[1, 'desc']],
                    responsive: true
                });
            }, 100);
        }
    }
}

// ==========================================
// INICIALIZACIÓN Y FUNCIONES GLOBALES
// ==========================================

// Instancias globales
const gestorUsuarios = new GestorDeUsuarios();
const gestorModales = new GestorDeModales();

// Actualizar interfaz según estado de sesión
function actualizarInterfazUsuario() {
    const sesion = gestorUsuarios.obtenerSesionActiva();
    const userNameDisplay = document.getElementById('user-name-display');
    const nombreUsuarioDropdown = document.getElementById('nombre-usuario-dropdown');
    const usuarioLogueadoInfo = document.getElementById('usuario-logueado-info');
    const usuarioNoLogueadoInfo = document.getElementById('usuario-no-logueado-info');

    if (sesion) {
        // Usuario logueado
        userNameDisplay.textContent = sesion.nombre.split(' ')[0]; // Solo el primer nombre
        nombreUsuarioDropdown.textContent = sesion.nombre;
        usuarioLogueadoInfo.style.display = 'block';
        usuarioNoLogueadoInfo.style.display = 'none';
    } else {
        // Usuario no logueado
        userNameDisplay.textContent = '';
        usuarioLogueadoInfo.style.display = 'none';
        usuarioNoLogueadoInfo.style.display = 'block';
    }
}

// Configurar eventos del menú de usuario
function configurarMenuUsuario() {
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    const btnAbrirLogin = document.getElementById('btn-abrir-login');
    const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
    const btnMisPedidos = document.getElementById('btn-mis-pedidos');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

    // Toggle del menú
    userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', () => {
        userDropdown.classList.remove('active');
    });

    // Prevenir cerrar al hacer clic dentro
    userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Botón abrir login
    btnAbrirLogin.addEventListener('click', () => {
        userDropdown.classList.remove('active');
        gestorModales.mostrarLogin();
    });

    // Botón abrir registro
    btnAbrirRegistro.addEventListener('click', () => {
        userDropdown.classList.remove('active');
        gestorModales.mostrarRegistro();
    });

    // Botón mis pedidos
    btnMisPedidos.addEventListener('click', () => {
        userDropdown.classList.remove('active');
        gestorModales.mostrarMisPedidos();
    });

    // Botón cerrar sesión
    btnCerrarSesion.addEventListener('click', () => {
        gestorModales.mostrarConfirmacion(
            '¿Cerrar sesión?',
            '¿Estás seguro que deseas cerrar tu sesión?',
            () => {
                gestorUsuarios.cerrarSesion();
                actualizarInterfazUsuario();
                gestorModales.mostrarInfo('Sesión Cerrada', 'Has cerrado sesión correctamente', 'info');
            }
        );
        userDropdown.classList.remove('active');
    });
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazUsuario();
    configurarMenuUsuario();
});
