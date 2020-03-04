const { exec } = require('../db/mysql');
const UUID = require('uuid-js');
const dateFormat = require('js-dateformat').dateFormat;
const generateId = () => {
    let id = UUID.create();
    id = id.toString();
    return id;
}

const getList = (author, keyword) => {
    let sql = `select * from  blogs where 1=1 `
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += `order by createtime desc;`
        
    return exec(sql);
}

const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}';`

    if(id)
        return exec(sql);
    return false;

}

const newBlog = (blogData = {}) => {
    let title = blogData.title;
    let content = blogData.content;
    let id = generateId();
    let author = blogData.author;
    let createTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');

    let sql = `insert into blogs (id,title,createtime,content,author) 
                values ('${id}','${title}','${createTime}','${content}','${author}');`
    return exec(sql);
}

const updateBlog = (id, blogData = {}) => {
    let title = blogData.title;
    let content = blogData.content;
    let sql = `update blogs set title='${title}', content='${content}' where id='${id}';`
    return exec(sql);
}

const delBlog = (id) => {
    let sql = `delete from blogs where id='${id}';`
    return exec(sql);
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}