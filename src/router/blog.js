const {SuccessModel,ErrorModel} = require('../model/resModel');
const {getList,getDetail,newBlog,updateBlog,delBlog} = require('../controller/blog');

const loginCheck = req => {
    if(!req.session.username) {
        return new SuccessModel('未登录')
    }
}


const handelBlogRouter = async (req, res) => {
    const method = req.method;
    const url = req.url;
    const path = url.split('?')[0]

    const result = loginCheck(req);
    if(result) {
        return result;
    }
    if(method === 'GET' && path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const listData = await getList(author,keyword);
        return new SuccessModel(listData);
    }
    // if(method === 'GET' && path === '/api/blog/list') {
    //     return {
    //         msg: 'blog列表'
    //     }
    // }


    if(method === 'GET' && path === '/api/blog/detail') {
        const result = loginCheck(req);
        if(result) {
            return result;
        }
        const id = req.query.id || '';
        const detailData = await getDetail(id);
        if(!detailData)
            return new ErrorModel();
        return new SuccessModel(detailData);
    }
    // if(method === 'GET' && path === '/api/blog/detail') {
    //     return {
    //         msg: 'blog详情'
    //     }
    // }

    if(method === 'POST' && path === '/api/blog/new') {
        const result = loginCheck(req);
        if(result) {
            return result;
        }

        const data = await newBlog(req.body)
        return new SuccessModel(data);
        
    }

    if(method === 'POST' && path === '/api/blog/update') {
        const result = loginCheck(req);
        if(result) {
            return result;
        }
        const id = req.query.id;
        const content = req.body;
        const data = await updateBlog(id,content);
        if(data)
            return new SuccessModel(data);
        return new ErrorModel('error');
    }


    if(method === 'GET' && path === '/api/blog/delete') {
        const result = loginCheck(req);
        if(result) {
            return result;
        }
        const id = req.query.id;
        const data = await delBlog(id);
        if(data) 
            return new SuccessModel(data);
        return new ErrorModel('error');
    }

}

module.exports = handelBlogRouter;