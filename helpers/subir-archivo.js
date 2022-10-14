const path = require('path');
// npm i uuid
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['jpg','png','gif'], carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length -1 ];
    
        // validar la extensión
        if( !extensionesValidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, sube un archivo: ${extensionesValidas}`);
        }
    
        //res.json({ extension });
    
        const nombreTemporal = uuidv4() + '.' + extension;
    
        const uploadPath = path.join( __dirname, '../uploads/', carpeta , nombreTemporal) ;
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
    
            //resolve(uploadPath);
            resolve(nombreTemporal);
        });
    })

}

module.exports = {
    subirArchivo
}