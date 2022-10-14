const express = require('express');
// npm i cors
const cors = require('cors');
// DDBB/config
const { dbConnection } = require('../ddbb/config');
// npm i express-fileupload@1.2.1
const fileUpload = require('express-fileupload');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //this.usuariosPath = '/api/usuarios';
        //this.authPath = '/api/auth';
        //this.categoriesPath = '/api/categorias';

        this.paths = {
            auth:       '/api/auth',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads',
        }

        // JWT - autenticacion
        this.authPath = '/api/auth'

        // conexión a DDBB con mongoose - DDBB/config.js
        this.conectarDB();

        // middleswares
        this.middlewares();
        // Rutas
        this.routes();
    }

    // conexión a DDBB con mongoose - DDBB/config.js
    async conectarDB(){
        await dbConnection();
    }
    
    middlewares(){  
        //Cors
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use( express.json() );

        // directorio publico
        this.app.use(express.static('public'));

        // Carga de archivos - express-fileupload
        // Note that this option available for versions 1.0.0 and newer. 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    
    routes(){
        //this.app.use( this.authPath, require('../routes/auth'));
        //this.app.use( this.usuariosPath, require('../routes/user'));
        //this.app.use( this.categoriesPath, require('../routes/categorias'));

        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.usuarios, require('../routes/user'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto:', this.port)
        });
    }
}

module.exports = Server;