
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
            cofactores[i][j] = signo * determinant(menor(M, i, j));

        } 
    } 
    // Intercambiar filas y columnas (transpuesta)
    const adjunta = cofactores[0].map((_,j)=> cofactores.map(row =>row[j]));
    return adjunta.map(row => row.map(valor => valor / det));

}

console.log(multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]])); // debería imprimir [[19, 22], [43, 50]]
console.log(determinant([[1, 2], [3, 4]])); // debería imprimir -2
console.log(inverse([[1, 2], [3, 4]])); // debería imprimir [[-2, 1], [1.5, -0.5]]