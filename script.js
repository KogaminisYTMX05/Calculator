// --- Variables de estado ---
let num1 = null;           // Primer número
let num2 = null;           // Segundo número
let operador = null;       // Operador actual (+, -, *, /)
let resultadoMostrado = false; // Bandera para saber si acabamos de mostrar un resultado

// --- Elementos del DOM ---
const pantalla = document.getElementById('pantalla');
const botonesNumero = document.querySelectorAll('[data-numero]');
const botonesOperador = document.querySelectorAll('[data-operador]');
const btnIgual = document.getElementById('btn-igual');
const btnClear = document.getElementById('btn-clear');
const btnPunto = document.getElementById('btn-punto');
const btnBackspace = document.getElementById('btn-backspace');

// --- 1. Funciones matemáticas básicas ---
function sumar(a, b) { return a + b; }
function restar(a, b) { return a - b; }
function multiplicar(a, b) { return a * b; }
function dividir(a, b) { 
    if (b === 0) return "¡Error! Ni Einstein podría dividir entre 0."; 
    return a / b; 
}

// --- 2. Función operate ---
function operate(operador, num1, num2) {
    let resultado;
    switch (operador) {
        case '+': resultado = sumar(num1, num2); break;
        case '-': resultado = restar(num1, num2); break;
        case '*': resultado = multiplicar(num1, num2); break;
        case '/': resultado = dividir(num1, num2); break;
        default: return "Error";
    }
    
    // Redondear decimales largos (Requisito 7)
    if (typeof resultado === 'number') {
        return Math.round(resultado * 100000000) / 100000000;
    }
    return resultado;
}

// --- 3. Actualizar pantalla ---
function actualizarPantalla(valor) {
    pantalla.textContent = valor;
}

// --- 4. Manejo de números (Clic en dígitos) ---
botonesNumero.forEach(boton => {
    boton.addEventListener('click', (e) => {
        let numeroPresionado = e.target.getAttribute('data-numero');
        
        // Si acabamos de mostrar un resultado y presionamos un número, empezamos de cero
        if (resultadoMostrado) {
            pantalla.textContent = numeroPresionado;
            resultadoMostrado = false;
        } else {
            // Si la pantalla ya tiene un número, lo concatenamos (a menos que sea el "0" inicial)
            if (pantalla.textContent === '0') {
                pantalla.textContent = numeroPresionado;
            } else {
                pantalla.textContent += numeroPresionado;
            }
        }
    });
});

// --- 5. Manejo de operadores (+, -, *, /) ---
botonesOperador.forEach(boton => {
    boton.addEventListener('click', (e) => {
        let operadorPresionado = e.target.getAttribute('data-operador');
        let valorPantalla = parseFloat(pantalla.textContent);

        // Si ocurre un error y presionamos operador, reiniciamos
        if (typeof valorPantalla !== 'number') {
            limpiarCalculadora();
            return;
        }

        // Requisito 7: Encadenamiento de operaciones (Ej: 12 + 7 - ...)
        if (num1 !== null && operador !== null && !resultadoMostrado) {
            num2 = valorPantalla;
            let resultado = operate(operador, num1, num2);
            
            // Si el resultado es el error de división por cero, lo mostramos y bloqueamos
            if (typeof resultado === 'string') {
                actualizarPantalla(resultado);
                num1 = null;
                operador = null;
                resultadoMostrado = true;
                return;
            }

            actualizarPantalla(resultado);
            num1 = resultado; // El resultado pasa a ser el nuevo num1
        } else {
            num1 = valorPantalla;
        }

        operador = operadorPresionado;
        resultadoMostrado = false;
    });
});

// --- 6. Botón Igual (=) ---
btnIgual.addEventListener('click', () => {
    // Si faltan datos, no hace nada
    if (num1 === null || operador === null) return; 
    
    let valorPantalla = parseFloat(pantalla.textContent);
    
    // Prevenir errores si la pantalla no es un número
    if (isNaN(valorPantalla)) return;

    num2 = valorPantalla;
    let resultado = operate(operador, num1, num2);
    
    actualizarPantalla(resultado);
    
    // Reiniciamos variables para la próxima operación
    num1 = null;
    num2 = null;
    operador = null;
    resultadoMostrado = true; 
});

// --- 7. Botón Borrar (C) ---
function limpiarCalculadora() {
    num1 = null;
    num2 = null;
    operador = null;
    actualizarPantalla('0');
    resultadoMostrado = false;
}
btnClear.addEventListener('click', limpiarCalculadora);

// ==========================================
// CRÉDITO EXTRA
// ==========================================

// Crédito extra 1: Botón de Punto Decimal
btnPunto.addEventListener('click', () => {
    if (resultadoMostrado) {
        pantalla.textContent = '0.';
        resultadoMostrado = false;
        return;
    }
    // Solo agregar punto si no hay uno ya
    if (!pantalla.textContent.includes('.')) {
        pantalla.textContent += '.';
    }
});

// Crédito extra 2: Botón de Retroceso (Backspace)
btnBackspace.addEventListener('click', () => {
    let textoActual = pantalla.textContent;
    if (resultadoMostrado || textoActual === 'Error' || textoActual.includes('Error')) {
        // Si hay un error o un resultado, borramos todo
        limpiarCalculadora();
    } else if (textoActual.length > 1) {
        // Quitamos el último carácter
        pantalla.textContent = textoActual.slice(0, -1);
    } else {
        // Si queda solo un dígito, lo cambiamos a 0
        pantalla.textContent = '0';
    }
});

// Crédito extra 3: Soporte de Teclado
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        document.querySelector(`[data-numero="${e.key}"]`).click();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        document.querySelector(`[data-operador="${e.key}"]`).click();
    } else if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault(); // Evita que Enter haga cosas raras
        btnIgual.click();
    } else if (e.key === '.') {
        btnPunto.click();
    } else if (e.key === 'Backspace') {
        btnBackspace.click();
    } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        limpiarCalculadora();
    }
});