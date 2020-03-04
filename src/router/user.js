
const {loginCheck} = require('../controller/user');
const {SuccessModel,ErrorModel} = require('../model/resModel');
const {get,set} = require('../db/redis');

const handleBlogUserRouter = async (req,res,userid) => {
    const method = req.method;
    const url = req.url;
    const path = url.split('?')[0]

    if(method === 'POST' && path === '/api/user/login') {

        const {username,password} = req.body;
        const result = await loginCheck(username,password);
        if(result[0]) {
            res.setHeader('Set-Cookie',`username=${result[0].username};path=/`)
            req.session.username = result[0].username;
            req.session.realname = result[0].realname;
            set(userid,req.session);
            return new SuccessModel();
        }
        return new ErrorModel('loginError');
        
    }

    if(method === 'GET' && path === '/api/user/login-test') {
        if(req.session.username) {
            return new SuccessModel('已登录')
        }
        return  new ErrorModel('未登录')
    }

}
module.exports = handleBlogUserRouter;