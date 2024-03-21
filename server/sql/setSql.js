const sql = require('mssql/msnodesqlv8')

const editUser = async (user, email) => {
    const query = `UPDATE Users SET Name = '${user.name}', Surname = '${user.surname}', UserName = '${user.username}', Biography = '${user.biography}', Email = '${user.email}' WHERE Email = '${email}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log("request error ->", error)
        return error
    }
}

const editPassword = async (email, password) => {
    const query = `UPDATE Users Set Password = '${password}' WHERE Email = '${email}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const editStyle = async (userId, bgColor, borderStyle, linkBgColor) => {
    const query = `UPDATE UserStyles set BackgroundColor = '${bgColor}', LinkBorderRadius = '${borderStyle}', LinkBackgroundColor = '${linkBgColor}' WHERE UserId = '${userId}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return error
    }
}   

const editQuestion = async (questionId, answer) => {
    const query = `UPDATE UserQuestions set Answer = '${answer}', AnsweredDate = GETDATE() WHERE Id = '${questionId}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const editQuestionLikes = async (likes) => {
    const query = `UPDATE UserQuestions set Likes = '${likes}'`
    try {
        const result = await sql.query(query)
        if (result.rowsAffected[0]){
            return {message: "success"}
        } else {
            return {error: "error"}
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = {editUser, editPassword, editStyle, editQuestion, editQuestionLikes}