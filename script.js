// Multiplicar Matrices
function multiply (A, B) {
    const filasA = A.length;
    const colsA = A[0].length
    const colsB = B[0].length;

    const resultado = [];
    for (let i =0; i < filasA; i++) {
        resultado.push(new Array(colsB).fill(0));
    }

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
    if (n === 1)    return M[0][0];
    if (n === 2)    return M[0][0] * M[1][1] - M[0][1] * M[1][0];

    let det = 0;
    for (let col =0; col < n; col++) {
        det += Math.pow(-1, col) * M[0][col] * determinant(menor(M, 0, col));
    }
    return det;
 }

 // Quitar una fila y columna para calcular el menor de una matriz
function menor(M, fila , col)  {
    return M
    .filter((_,i) => i !== fila)
    .map(row => row.filter((_,j) => j !== col));
}

// Calcular la inversa de una matriz cuadrada
function inverse(M) {
    const det = determinant(M);
    if (det === 0) {
        return null;
    }
    const n = M.length;

    if (n === 2) {
        return [
            [M[1][1] / det, -M[0][1] / det],
            [-M[1][0] / det, M[0][0] / det]
        ];
    }

    const cofactores = [];
    for (let i = 0 ; i< n; i++) {
        cofactores.push([]);
        for (let j = 0 ; j<n; j++) {
            let signo = ((i + j) % 2 === 0) ? 1 : -1;
            cofactores[i][j] = signo * determinant(menor(M, i, j));
        } 
    } 
    const adjunta = cofactores[0].map((_,j)=> cofactores.map(row =>row[j]));
    return adjunta.map(row => row.map(valor => valor / det));
}

// Tabla de Codificacion
const CHAR_TO_NUM = {
  'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,'J':10,
  'K':11,'L':12,'M':13,'N':14,'O':15,'P':16,'Q':17,'R':18,'S':19,
  'T':20,'U':21,'V':22,'W':23,'X':24,'Y':25,'Z':26,' ':0,'.':27,',':28
};

const NUM_TO_CHAR = {};
for (let letra in CHAR_TO_NUM) {
  let numero = CHAR_TO_NUM[letra];
  NUM_TO_CHAR[numero] = letra;
}

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

function chunkIntoMatrix(numeros, filas) {
  let columnas = Math.ceil(numeros.length / filas);
  let listaCompleta = numeros.slice();
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

function flattenMatrix(matriz) {
  let numeros = [];
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      numeros.push(matriz[i][j]);
    }
  }
  return numeros;
}

// Copia el texto de un elemento al portapapeles
function copyToClipboard(idElementoTexto, idBoton) {
  let texto = document.getElementById(idElementoTexto).textContent;

  if (texto.trim() === "") {
    return; // no hay nada que copiar todavía
  }

  navigator.clipboard.writeText(texto).then(function() {
    let boton = document.getElementById(idBoton);
    let textoOriginal = boton.textContent;
    boton.textContent = "¡Copiado!";
    setTimeout(function() {
      boton.textContent = textoOriginal;
    }, 1500);
  });
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
  let mensaje = document.getElementById("mensajetexto").value;
  let numeros = textToNumbers(mensaje);

  let n = parseInt(document.getElementById("tamano-matriz").value);
 let M = readMatrix(n);
   let filas = M.length;

  if (determinant(M) === 0) {
    document.getElementById("resultadoEncriptado").textContent =
      "La matriz clave no es invertible. Cambia sus valores.";
    return;
  }

  let matrizMensaje = chunkIntoMatrix(numeros, filas);
  let matrizCifrada = multiply(M, matrizMensaje);
  let resultado = flattenMatrix(matrizCifrada);

  document.getElementById("resultadoEncriptado").textContent = resultado.join(", ");
});

// Botón "Desencriptar"
document.getElementById("btnDesencriptar").addEventListener("click", function() {
  let texto = document.getElementById("numeroscifrados").value;
  let numeros = texto.split(",").map(function(n) { return parseFloat(n.trim()); });

  let n = parseInt(document.getElementById("tamano-matriz").value);
  let M = readMatrix(n);

  if (determinant(M) === 0) {
    document.getElementById("resultadoEncriptado").textContent =
      "La matriz clave no es invertible. Cambia sus valores.";
    return;
  }
  let filas = M.length;
  let Minversa = inverse(M);

  let matrizCifrada = chunkIntoMatrix(numeros, filas);
  let matrizOriginal = multiply(Minversa, matrizCifrada);

  let numerosRedondeados = flattenMatrix(matrizOriginal).map(function(n) {
    return Math.round(n);
  });

  document.getElementById("resultadoDesencriptado").textContent = numbersToText(numerosRedondeados);
});

// Botones "Copiar resultado"
document.getElementById("btnCopiarEncriptado").addEventListener("click", function() {
  copyToClipboard("resultadoEncriptado", "btnCopiarEncriptado");
});

document.getElementById("btnCopiarDesencriptado").addEventListener("click", function() {
  copyToClipboard("resultadoDesencriptado", "btnCopiarDesencriptado");
});

// Llenamos la tabla de codificación
buildCodeTable();