const {exec} = require()


const serverhandle = (req,res) => {
    res.setHeader('Content-type', 'application/json');

    const resData = {
        name: 'xxx',
        site: 'xx',
        env: process.env.NODE_ENV
    }

    res.end(JSON.stringify(resData));
}

module.exports = serverhandle;