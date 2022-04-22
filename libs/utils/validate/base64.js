export default {
    send_code
}
function send_code(code) {
    const fsm = uni.getFileSystemManager();
    const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(code) || [];
    if (!format) {
      return (new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = uni.base64ToArrayBuffer(bodyData);

    //将base64图片写入
    return new Promise((resolve, reject) => {
        
        fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success() {
                resolve(filePath);
            },
            fail() {
                resolve(false);
            },
        });
    })
}