const sql = require('mssql/msnodesqlv8')

// strEmail = "Email"
const selectUser = async (email, strEmail) => {
    const query = `select * from Users where ${strEmail} = '${email}'`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

// queryParam = "UserId"
const selectExistLinks = async (userId, queryParam, id, Id) => {

    const query = `select count (*) from Links where ${queryParam} = '${userId}' and ${Id} = ${id}`

    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

// queryParam = "UserId"
const selectUserLinks = async (userId, queryParam) => {

    const query = `select * from Links where ${queryParam} = ${userId}`
    
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}


const selectPages = async (pageSlug) => {
    const query = `select * from Pages where Slug = '${pageSlug}'` 
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

module.exports = {selectUser, selectUserLinks, selectPages, selectExistLinks}