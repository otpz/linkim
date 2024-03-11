const sql = require('mssql/msnodesqlv8')

const insertUser = async (name, surname, username, email, password) => {
    const query = `insert into Users (Email, Password, UserName, Name, Surname, JoinDate) values ('${email}', '${password}', '${username}', '${name}', '${surname}', GETDATE())`
    try {
        const result = await sql.query(query)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

const insertLink = async (userId, title, link) => {
    const query = `insert into Links (UserId, Title, LinkUrl, CreatedDate) values ('${userId}', '${title}', '${link}', GETDATE())`
    try {
        const result = await sql.query(query)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = {insertUser, insertLink}