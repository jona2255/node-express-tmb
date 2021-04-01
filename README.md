# Ejercicio Node.js API TMB

Crea un servidor en Node.js con Express. El servidor debe tener un directorio de recursos estáticos donde habrá un archivo llamado `instrucciones.txt` y una imagen llamada `mapa-metro.jpg`.

Además debe tener dos endpoints que devuelven información en JSON:

/metro/lineas
Este endpoint debe devolver un array con todas las líneas de metro, donde cada línea tendrá este formato:
```javascript
{
    id: x,
    linea: "L2",
    descripcion: "Descripción de la línea"
}
```

/metro/linea/<linea>
Este endpoint debe devolver un objeto con dos propiedades:
```javascript
{
    linea: "L2",
    descripcion: "Descripción de la línea",
    paradas: [
        {
            id: x,
            nombre: "Nombre parada"
        },
        ...
    ]
}
```

Si se pide un endpoint que no existe debe devolver un status 404 y este JSON:
```javascript
{ error: true, mensaje: "Recurso no encontrado"}
```

Si hay algún error general, debe devolver un status 500 y este JSON:
```javascript
{ error: true, mensaje: "Error general"}
```

Si se hace alguna petición con los métodos PUT, POST o DELETE, debe devolver un status 403 y este JSON:
```javascript
{ error: true, mensaje: "Te pensabas que podías hackearme" }
```
