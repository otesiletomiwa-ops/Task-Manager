const notFound = (req, res, next) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'ZodError') {
        return res.status(400).json({ error: err.errors });
    }

    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal server error'
    });
};

module.exports = { notFound, errorHandler };