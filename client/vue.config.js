module.exports = {
    devServer: {
        proxy: {
            '/file': {
                target: 'http://localhost:3001'
            }
        }
    }
}