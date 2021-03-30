module.exports = {
    devServer: {
        // 项目运行时候的端口号
        port: 8081,
    },
    configureWebpack: {
        externals: {
            'BMap': 'BMap',
            'BMap_Symbol_SHAPE_POINT': 'BMap_Symbol_SHAPE_POINT'
        },
    }

};