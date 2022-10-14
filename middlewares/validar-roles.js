const { response, request } = require("express");


const esAdminRole = (req, res = response, next) => {

   if( !req.usuario ){
        return res.status(401).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
   }

   const { rol, nombre } = req.usuario;

   if( rol !== 'ADMIN_ROLE' ){
    return res.status(401).json({
        msg: `El ${nombre} no es un rol administrador y no puede realizar esa acción`
    })
   }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {
        //console.log(roles);
        if( !req.usuario ){
            return res.status(401).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if( !roles.includes( req.usuario.rol )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}