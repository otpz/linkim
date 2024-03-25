
const sql = require('mssql/msnodesqlv8')

const deleteUserLink = async (id) => {
    const query = `delete from Links where Id = ${id}`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        return error
    }
}

const deleteResetPassToken = async (token) => {
    const query = `delete from ResetPassTokens where Token = '${token}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        return error
    }
}

const deleteUserQuestion = async (questionId) => {
    const query = `delete from UserQuestions where Id = '${questionId}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        return error
    }
}

const deleteQuestionLike = async (questionId, userId) => {
    const query = `delete from Likes where QuestionId = '${questionId}' and UserId = '${userId}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        return error
    }
}

module.exports = {deleteUserLink, deleteResetPassToken, deleteUserQuestion, deleteQuestionLike}