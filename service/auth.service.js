const API_AUTH = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (token && window.location.pathname.includes('login.html')) {
        window.location.href = 'login';
    }

    const form = document.getElementById('loginForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMessage = document.getElementById('errorMessage');

            try {
                const response = await fetch(`${API_AUTH}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = data.message || 'No se pudo iniciar sesión';
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                window.location.href = 'index.html';

            } catch (error) {
                console.error(error);
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Error de conexión con el servidor';
            }
        });
    }
});

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

function obtenerToken() {
    return localStorage.getItem('token');
}

function obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}