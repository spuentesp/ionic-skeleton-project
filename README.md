# Ionic Skeleton Project

## Prerequisitos

* Node.js
* Android SDK
* Xcode (Solo Mac)

## Instalacion

ejecutar los siguientes comandos tras obtener el branch desde github:

* npm install
* bower install --force
* ionic state restore

se recomienda usar chmod y chown para cambiar la propiedad de carpeta al usuario que desarrolle, y dar permisos de ejecucion a la carpeta.
No se recomienda ejecutar comandos de ionic/cordova con sudo.

## Perfiles de creacion

gulp tiene dos perfiles configurados:

### version dev
* gulp dev

o bien

* gulp

este script inyectara todos los archivos del proyecto y librerias en index.html y hara un orden de codigo.

### version release
* gulp release

este script concatenara todos los archivos de proyecto en un solo JS, creara las importaciones explicitas, y minifica el codigo. elimina las inyecciones de archivos separados, dejando solo el js minificado

## Pruebas unitarias
* gulp test
Esto ejecutara Karma con las pruebas predefinidas. Estas se guardan en la carpeta tests
Las pruebas fueron creadas con Jasmine (mas info para su construccion :https://jasmine.github.io/)
## Ejecutar en servidor local
* ionic serve
para probar sobre un servidor local (Cordova no se ejecutara)

para probar sobre dispositivos, se recomienda usar Xcode en mac, o usar ionic run android con un dispositivo conectado y con depuracion USB activada (asegurarse que sea detectado usando el comando 'adb devices')


## Autor

* **Sebastian Puentes** - *Commit inicial* - (spuentesp@gmail.com)
