const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
var objectId = require('mongodb').ObjectID;
const adminModel = require('../../models/Admin');
const userModel = require('../../models/User');


exports.getAllUsers = (req, res) => {
    try {
        let users = await userModel.find().sort({
            _id: -1
        });
        responses.success(res, `Success`, users);
    } catch (e) {
        console.log('**********************Error in getting all users***************');
        responses.sendErrorMessage(res, "Something Went Wrong while fetching user list");
    }
}

exports.getAllAnonymousUsers = (req, res) => {
    try {
        let users = await userModel.find({
            is_anonymous: true
        });

        responses.success(res, `Success`, users);

    } catch (e) {
        console.log('**********************Error in getting all anonymous users***************');
        responses.sendErrorMessage(res, "Something Went Wrong while fetching anonymous list");
    }
}

exports.getAdminProfile = (req, res) => {
    try {
        let adminId = req.body.id;
        let admin = await adminModel.findById(adminId);
        responses.success(res, 'Success', admin);
    } catch (e) {
        console.log('**********************Error in getting all admin user***************');
        responses.sendErrorMessage(res, "Something Went Wrong while fetching admin");
    }
}

exports.updateAdminProfile=(req,res)=>{
    try{
        let adminId=req.params.id;
        let adminUpdateQuery=req.body;

        let admin=await adminModel.findByIdAndDelete(adminId,{$set:adminUpdateQuery});
        responses.success(res,'Success',admin);
    }
    catch(e){
       console.log('**********************Error in updating admin user***************');
       responses.sendErrorMessage(res, "Something Went Wrong while updating admin");
    }
}