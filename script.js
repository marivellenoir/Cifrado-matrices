
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

// Tabla Codoficacion
const CHAR_TO_NUM = {
  'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,'J':10,
  'K':11,'L':12,'M':13,'N':14,'O':15,'P':16,'Q':17,'R':18,'S':19,
  'T':20,'U':21,'V':22,'W':23,'X':24,'Y':25,'Z':26,' ':0,'.':27,',':28
};

// Pasa de número a letra
const NUM_TO_CHAR = {};
for (let letra in CHAR_TO_NUM) {
  let numero = CHAR_TO_NUM[letra];
  NUM_TO_CHAR[numero] = letra;
}

// Convierte un mensaje de texto en una lista de números
function textToNumbers(texto) {
  let mayusculas = texto.toUpperCase();
  let numeros = [];
  for (let i = 0; i < mayusculas.length; i++) {
    let letra = mayusculas[i];
    if (letra in CHAR_TO_NUM) {
      numeros.push(CHAR_TO_NUM[letra]);
    }
  }
  return numeros;
}

// Convierte una lista de números de vuelta a texto
function numbersToText(numeros) {
  let texto = "";
  for (let i = 0; i < numeros.length; i++) {
    let numero = numeros[i];
    if (numero in NUM_TO_CHAR) {
      texto += NUM_TO_CHAR[numero];
    }
  }
  return texto;
}

// Acomoda una lista de números en una matriz de "filas" filas
// Rellena con ceros si faltan espacios
function chunkIntoMatrix(numeros, filas) {
  let columnas = Math.ceil(numeros.length / filas);
  let listaCompleta = numeros.slice(); // copia la lista
  while (listaCompleta.length < filas * columnas) {
    listaCompleta.push(0);
  }

  let matriz = [];
  for (let i = 0; i < filas; i++) {
    let fila = [];
    for (let j = 0; j < columnas; j++) {
      fila.push(listaCompleta[i * columnas + j]);
    }
    matriz.push(fila);
  }
  return matriz;
}

// Convierte una matriz de vuelta a una sola lista de números
function flattenMatrix(matriz) {
  let numeros = [];
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      numeros.push(matriz[i][j]);
    }
  }
  return numeros;
}

// Calcula la matriz inversa usando cofactores(se usa para desencriptar)
function calcularInversa(M) {
  let n = M.length;
  let det = calcularDeterminante(M);

  let matrizCofactores = [];
  for (let i = 0; i < n; i++) {
    let fila = [];
    for (let j = 0; j < n; j++) {
      let subMatriz = obtenerSubMatriz(M, i, j);
      let signo = ((i + j) % 2 === 0) ? 1 : -1;
      fila.push(signo * calcularDeterminante(subMatriz));
    }
    matrizCofactores.push(fila);
  }

  // La inversa es la transpuesta de los cofactores, dividida entre el determinante
  let inversa = [];
  for (let i = 0; i < n; i++) {
    let fila = [];
    for (let j = 0; j < n; j++) {
      fila.push(matrizCofactores[j][i] / det);
    }
    inversa.push(fila);
  }
  return inversa;
}

// Llena la tabla de codificación automáticamente
function buildCodeTable() {
  let tabla = document.getElementById("tablaCodigos");
  for (let letra in CHAR_TO_NUM) {
    let fila = document.createElement("tr");

    let celdaLetra = document.createElement("td");
    celdaLetra.textContent = (letra === " ") ? "espacio" : letra;

    let celdaNumero = document.createElement("td");
    celdaNumero.textContent = CHAR_TO_NUM[letra];

    fila.appendChild(celdaLetra);
    fila.appendChild(celdaNumero);
    tabla.appendChild(fila);
  }
}

// Botón "Encriptar"
document.getElementById("btnEncriptar").addEventListener("click", function() {
  let mensaje = document.getElementById("mensajeTexto").value;
  let numeros = textToNumbers(mensaje);

  let M = readMatrix(); // función de Persona A: lee la matriz clave
  let filas = M.length;

  if (calcularDeterminante(M) === 0) {
    document.getElementById("resultadoEncriptado").textContent =
      "La matriz clave no es invertible. Cambia sus valores.";
    return;
  }

  let matrizMensaje = chunkIntoMatrix(numeros, filas);
  let matrizCifrada = multiplicarMatrices(M, matrizMensaje);
  let resultado = flattenMatrix(matrizCifrada);

  document.getElementById("resultadoEncriptado").textContent = resultado.join(", ");
});

// Botón "Desencriptar"
document.getElementById("btnDesencriptar").addEventListener("click", function() {
  let texto = document.getElementById("numerosCifrados").value;
  let numeros = texto.split(",").map(function(n) { return parseFloat(n.trim()); });

  let M = readMatrix();
  let filas = M.length;
  let Minversa = calcularInversa(M);

  let matrizCifrada = chunkIntoMatrix(numeros, filas);
  let matrizOriginal = multiplicarMatrices(Minversa, matrizCifrada);

  // Redondeamos 
  let numerosRedondeados = flattenMatrix(matrizOriginal).map(function(n) {
    return Math.round(n);
  });

  document.getElementById("resultadoDesencriptado").textContent = numbersToText(numerosRedondeados);
});

// Llenamos la tabla de codificación
buildCodeTable();