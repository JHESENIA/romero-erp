document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const usuarioInfo = document.createElement('div');
        usuarioInfo.style.display = 'flex';
        usuarioInfo.style.alignItems = 'center';
        usuarioInfo.style.gap = '12px';

        usuarioInfo.innerHTML = `
            <span style="font-size:14px;color:#334155;">
                ${usuario.nombre || 'Usuario'}
            </span>
            <button onclick="cerrarSesion()" style="
                padding: 8px 12px;
                border: none;
                border-radius: 8px;
                background: #dc2626;
                color: white;
                cursor: pointer;
                font-weight: bold;
            ">
                Salir
            </button>
        `;

        navbar.appendChild(usuarioInfo);
    }
});

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}