module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: ['./src/**/*.js', './public/index.html'],
    theme: {
        extend: {},
        container: {
            center: true,
            padding: '2rem',
        },
    },
    variants: {},
    plugins: [],
}