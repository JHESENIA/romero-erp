/**
 * ============================================================================
 * COMPONENTE: GESTOR Y VALIDADOR DE FORMULARIOS
 * Archivo: frontend/src/components/formValidations.js
 * ============================================================================
 */

class FormManager {
    
    /**
     * Extrae los datos de un formulario y valida que los campos obligatorios estén llenos.
     * @param {string} formId - El ID del formulario HTML (Ej: 'formAccion')
     * @returns {Object|null} - Retorna un objeto con los datos si es válido, o null si hay errores.
     */
    static validateAndGetData(formId) {
        const form = document.getElementById(formId);
        
        if (!form) {
            console.error(`Error: No se encontró el formulario con ID "${formId}"`);
            return null;
        }

        let isValid = true;
        const data = {};
        
        // Seleccionamos todos los inputs, selects y textareas del formulario
        const elements = form.querySelectorAll('input, select, textarea');

        // 1. Limpiar mensajes de error previos
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        elements.forEach(el => el.style.borderColor = 'var(--border-color)');

        // 2. Recorrer cada elemento para validar y extraer su valor
        elements.forEach(element => {
            // Ignoramos los botones, no queremos enviarlos a la base de datos
            if (element.type === 'submit' || element.type === 'button') return;

            const value = element.value.trim();
            const isRequired = element.hasAttribute('required');
            const elementId = element.id;

            // Validación: Si es obligatorio y está vacío
            if (isRequired && value === '') {
                isValid = false;
                this.showError(element, 'Este campo es obligatorio');
            }

            // Si el elemento tiene ID, lo guardamos en nuestro objeto de datos
            // Ejemplo: data['NOMBRE_ACCION'] = 'Mantenimiento'
            if (elementId) {
                data[elementId] = value;
            }
        });

        return isValid ? data : null;
    }

    /**
     * Muestra visualmente un error debajo del input que falló.
     */
    static showError(element, message) {
        // Pintar el borde de rojo
        element.style.borderColor = 'var(--status-error)';
        
        // Crear un texto de error debajo del input
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--status-error)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.style.fontWeight = '500';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insertarlo justo después del input
        element.parentNode.appendChild(errorDiv);
    }

    /**
     * Llena automáticamente un formulario con los datos que vienen de la Base de Datos.
     * Útil para cuando hacemos clic en el botón "Editar" de la tabla.
     * @param {string} formId - El ID del formulario HTML
     * @param {Object} rowData - El objeto con los datos de la fila (Ej: { ID_ACCION: 1, NOMBRE_ACCION: '...' })
     */
    static fillForm(formId, rowData) {
        const form = document.getElementById(formId);
        if (!form || !rowData) return;

        // Recorremos las llaves de nuestro objeto de datos
        Object.keys(rowData).forEach(key => {
            // Buscamos si existe un input con ese mismo ID
            const input = form.querySelector(`#${key}`);
            if (input) {
                input.value = rowData[key];
            }
        });
    }

    /**
     * Limpia completamente un formulario (Inputs y errores visuales)
     */
    static resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            // Limpiar errores visuales
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.form-control').forEach(el => el.style.borderColor = 'var(--border-color)');
            
            // Si tienes campos ocultos (como el ID para editar), también hay que vaciarlos
            form.querySelectorAll('input[type="hidden"]').forEach(el => el.value = '');
        }
    }
}