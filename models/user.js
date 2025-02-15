const { Schema, model } = require("mongoose")
const Joi = require("joi")

const handleSaveErrors = require("../helpers/handelSaveErrors")

const emailRegexp = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/ 

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp, 
        unique:true,
        required: true,
    },
    password: {
        type: String,
        minlenght:6,
        required: true,
    }
}, { versionKey: false, timestamps: true })

userSchema.post("save", handleSaveErrors)

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const schemas = {
    registerSchema,
    loginSchema,  
}

const User = model("user", userSchema)

module.exports = {
    User, 
    schemas,
}