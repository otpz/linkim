const express = require('express')

// const { insertUser } = require('../sql/insertSql')
const insertUser = require('../sql/insertSql')

// login endpoint
const loginUser = async (req, res) => {
    const {email, password} = req.body

    console.log(email, password)

    res.json({email: email, password: password})
}

// register endpoint
const registerUser = async (req, res) => {
    const {name, surname, username, email, password} = req.body
    try {
        const result = await insertUser(name, surname, username, email, password)
        if (result.name === "RequestError"){
            res.json({error: "RequestError"})
        }
        res.json({message: "Kayıt başarıyla oluşturuldu"})
    } catch (error) {
        console.log(error)
        res.json({error: error})        
    }
}

module.exports = {loginUser, registerUser}