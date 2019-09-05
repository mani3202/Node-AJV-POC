const Ajv = require('ajv'),
    ajv = new Ajv({ allErrors: true, removeAdditional: 'all' }),
    express = require('express'),
    app = express(),
    PORT = process.env.PORT || 5000,
    employeeSchema = require('./schema');
    ajv.addSchema(employeeSchema,'new-employee');
    app.use(express.json());
    app.use(express.urlencoded());
const errorResponse = (schemaErrors) => {
    console.log(schemaErrors);
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        }
    });
    return {
        status: 'failed',
        errors: errors
    }
}
const validateSchema = (schemaName) => {
    return (req,res,next) => {
        let isValid = ajv.validate(schemaName,req.body);
        console.log(isValid);
        if(!isValid) {
            res.status(400).json(errorResponse(ajv.errors));
        } else {
            next();
        }
    }
}
app.post('/signup',validateSchema('new-employee'),(req,res) => {
    res.send(req.body);
})
app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
})
