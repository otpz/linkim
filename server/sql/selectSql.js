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
const selectUserLinks = async (id, queryParam) => {
    const query = `select * from Links where ${queryParam} = ${id}`
    try {
        const result = await sql.query(query)
        return result.recordset
    } catch (error) {
        return error
    }
}

module.exports = {selectUser, selectUserLinks}