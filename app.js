const handelBlogRouter = require('./src/router/blog')
const handleBlogUserRouter = require('./src/router/user');
const querystring = require('querystring');
const {set,get} = require('./src/db/redis');

// const SESSION_DATA = {};

const getPostData = (req) => {
    const promise = new Promise((rs,rj) => {
        if(req.method !== 'POST') {
            rs({})
            return;
        }
        if(req.headers['content-type'] !== 'application/json') {
            rs({})
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        });
        req.on('end', (err) => {
            if(!postData) {
                rs({});
                return
            }
            rs(
                JSON.parse(postData)
            );
        })
    })
    return promise;
}

const serverhandle = async (req,res) => {
    res.setHeader('Content-type', 'application/json');

    req.query = querystring.parse(req.url.split('?')[1]);

    req.cookie = {};
    const cookieSet = req.headers.cookie || '';
    cookieSet.split(';').forEach(item => {
        if(!item) return;
        item = item.trim();
        let arr = item.split('=');
        let key = arr[0];
        let val = arr[1];
        req.cookie[key] = val;
    });

    let userid = req.cookie.userid;
    let needSetCookie = false;
    if(userid) {
        try {
            var isExist = await get(userid);
            if(isExist)
                set(userid,isExist);
        } catch (error) {
            
        }
        
        // if(!SESSION_DATA[userid])
        //     SESSION_DATA[userid] = {};
    }else{
        needSetCookie = true;
        userid = Date.now() +'_'+ Math.random();
        // SESSION_DATA[userid] = {};
        set(userid,{});
    }
    // req.session = SESSION_DATA[userid];
    req.session = await get(userid);
    console.log(req.cookie);


    getPostData(req).then(async data => {
        req.body = data;

        const userData = await handleBlogUserRouter(req,res,userid);
        if(userData) {
            if(needSetCookie) {
                res.setHeader('Set-Cookie',`userid=${userid}; path=/; httpOnly`);
            }
            res.end(JSON.stringify(userData));
            return
        }
        const blogData = await handelBlogRouter(req,res);
    
        if(blogData) {
            if(needSetCookie) {
                res.setHeader('Set-Cookie',`userid=${userid}; path=/; httpOnly`);
            }
            res.end(JSON.stringify(blogData))
            return;
        }
        res.writeHead(404,{"Content-type": "text/plain"})
        res.write("404 Not Found")
        res.end();

    });

}

module.exports = serverhandle;