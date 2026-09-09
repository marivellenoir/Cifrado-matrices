
// Multiplicar Matrices
function multiply (A, B) {
    const filasA = A.length;
    const colsA = A[0].length
    const colsB = B[0].length;

    //creamos la matriz vacia del resultado en el tamaño correcto
    const resultado = [];
    for (let i =0; i < filasA; i++) {
        resultado.push(new Array(colsB).fill(0));

    }

    // La multiplicación de matrices (fila de A X columna de B, sumando)
    for (let i =0; i < filasA; i++) {
        for (let j =0; j < colsB; j++) {
            let suma = 0;
            for (let k =0; k< colsA; k++) {
                suma += A[i][k] * B[k][j];
            }
            resultado[i][j] = suma;
        }
    }

    return resultado;
}

// Calcular el determinante de una matriz cuadrada
 function determinant (M) {
    const n = M.length;
    // matriz 1X1
    if (n === 1)    return M[0][0];

    // matriz 2X2
    if (n === 2)    return M[0][0] * M[1][1] - M[0][1] * M[1][0];

    // Matriz nxn 

    let det = 0;
    for (let col =0; col < n; col++) {
        det += Math.pow(-1, col) * M[0][col] * determinant(menor(M, 0, col));

    }
    return det;

 }

 // Quitar una final y columna para el calcular el menor de una matriz
function menor(M, fila , col)  {
    return M
    .filter((_,i) => i !== fila)
    .map(row => row.filter((_,j) => j !== col));

}



// Calcular la inversa de una matriz cuadrada
function inverse(M) {
    const det = determinant(M);
    if (det === 0) {
        return null;  // La matriz no tiene inversa
    }
    const n = M.length;

    // caso base para matrices 2x2
    if (n === 2) {
        return [
            [M[1][1] / det, -M[0][1] / det],
            [-M[1][0] / det, M[0][0] / det]

        ];
    }

    // caso general para matrices nxn: matriz de cofactores, luego transpuesta y dividir por el determinante
    const cofactores = [];
    for (let i = 0 ; i< n; i++) {
        cofactores.push([]);
        for (let j = 0 ; j<n; j++) {
            const signo = Math.pow(-1,i+j);
            cofactores[i][j] = signo * determinant(menor(M, i, j));

        } 
    } 
    // Intercambiar filas y columnas (transpuesta)
    const adjunta = cofactores[0].map((_,j)=> cofactores.map(row =>row[j]));
    return adjunta.map(row => row.map(valor => valor / det));

}

// matriz predeterminada 

function defaultMatrix(n) {

    const matriz = [];
    for (let i =0; i < n; i++) {
        const fila =[];
        for(let j = 0; j <n; j++) {
        fila.push(i===j ? 1 : 0); // pone 1 en la diagonal y 0 en el resto de espacios.
        
    }
        matriz.push(fila)
    }

return matriz;
}



// dibujar la cuadricula en la pagina.

function buildMatrixGrid(n, valores) {

    const grid = document.getElementById("matriz-grid");
    grid.innerHTML = "" // limpia la tabla construida anteriormente 
    grid.style.gridTemplateColumns = `repeat(${n}, 1fr)` // n columnas iguales

    for(let i=0; i<n; i++){
        for (let j=0; j<n; j++) {

            const input = document.createElement("input");
            input.type = "number";
            input.className = "celda-matriz";
            input.dataset.fila = i;
            input.dataset.col = j;
            input.value = valores [i][j];
            input.addEventListener("input",() => updateDetFlag(n)); // para que recalcule cada vez que el usuario cambie los numeros manualmente.
            grid.appendChild(input);

        }

    }
}

// funcion para que la pagina lea lo que el usuario escribe en la matriz M

function readMatrix(n) {

    const inputs = document.querySelectorAll(".celda-matriz");
    const matriz = [];
    for (let i=0 ; i<n ; i++ ) {
        matriz.push(new Array(n).fill(0));
    }

    inputs.forEach(input => {
        const fila = parseInt(input.dataset.fila);
        const col = parseInt(input.dataset.col);
        matriz [fila][col] = parseFloat(input.value) || 0;
    });
    
    return matriz;
}

// funcion que muestra si la matriz es invertible

function updateDetFlag (n) {
    const matriz = readMatrix(n);
    const det = determinant(matriz);
    const estado = document.getElementById("det-status");

    if (det === 0){
        estado.textContent = `det(M) = ${det.toFixed(2)} - No Invertible`;
        estado.className = "det-status bad";
    } 
        else {
        estado.textContent = `det(M) = ${det.toFixed(2)} - Invertible`;
        estado.className = "det-status ok";

    }

}

// crear la matriz aleatoria invertible

function randomInvertibleMatrix (n) {
    let matriz;
    let intentos = 0;

    do{
        matriz = [];
        for (let i = 0; i<n; i++) {
            const fila =[];
            for (let j = 0; j < n; j++) {
                fila.push(Math.floor(Math.random() * 19)-9); //genera numeros entre -9 y 9
            }

            matriz.push(fila);
        }

        intentos++;
    
    } while (determinant(matriz)=== 0 && intentos < 100);

    return matriz;
}

// instrucciones para conectar todas las funciones y ejecuta el codigo en la pagina.

const selectorTamano = document.getElementById("tamano-matriz");
const botonGenerar = document.getElementById("btn-generar-matriz");

function iniciarMatriz () {
    const n = parseInt(selectorTamano.value);
    buildMatrixGrid(n, defaultMatrix(n));
    updateDetFlag(n);

}

selectorTamano.addEventListener("change",iniciarMatriz);

botonGenerar.addEventListener("click", () =>{
    const n = parseInt(selectorTamano.value);
    const nuevaMatriz = randomInvertibleMatrix(n);
    buildMatrixGrid(n, nuevaMatriz);
    updateDetFlag(n);
});

iniciarMatriz(); // dibuja la matriz por defecto al cargar la pagina.







