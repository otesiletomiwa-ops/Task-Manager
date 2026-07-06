const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.validatedData = schema.parse(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                error: error.errors
            });
        }
    };
};

module.exports = validate;