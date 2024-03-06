const sql = require('mssql/msnodesqlv8')

const selectUser = async (email) => {
    const query = `select * from Users where Email = '${email}'`
    try {
        const result = await sql.query(query)
        return result.recordset[0]
    } catch (error) {
        return error
    }
}

module.exports = selectUser