const redis = require('redis');
const {REDIS_CONF} = require('../conf/db');

const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);
redisClient.on('error', err => {
    console.log(err);
});

function set(key,val) {
    if(typeof val === 'object') {
        val = JSON.stringify(val);
    }
    redisClient.set(key,val,redis.print);
}

function get(key) {
    return  new Promise((rs,rj) => {
                    redisClient.get(key,(err,val) => {
                        if(err){
                            rj(err);
                            return
                        }
                        if(val == null){
                            rs(null);
                            return;
                        }
                        try {
                            rs(JSON.parse(val));
                        } catch (e) {
                            rs(val);
                        }
                        
                    })
                });
}

module.exports = {
    set,
    get
}