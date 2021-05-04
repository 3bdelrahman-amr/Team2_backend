const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const Model = require("../models/user.model");
////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.register = async (req, res, next) => {
    const hashpass = await bcrypt.hashSync(req.body.Password);

    await Model.UserModel.create({
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        UserName: req.body.Email.split('@')[0],
        Email: req.body.Email,
        Date_joined: Date.now(),
        Age: (req.body.Age),
        Password: hashpass
    }, (err, user) => {

        if (err) {
            res.status(400).send("bad request, error while trying to insert user in database," +
                " make sure you sent the data with the right sntax");
            // console.log(err);
        }
        res.locals.userid = user._id;
        user.save();
        next();
    }
    );

};
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetUser = (req, res) => {
    Model.UserModel.findById({ _id: res.locals.userid }, { Password: 0 }, (err, user) => {
        if (err)
            res.status(400).send({ message: 'bad request' });
        if (!user)
            res.status(404).send({ message: 'user not found' });
        res.status(200).send(user);



    })
};
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.login = (req, res, next) => {

    Model.UserModel.findOne({ Email: req.body.Email }, (_err, _user) => {

        if (_user) {

            bcrypt.compare(req.body.Password, _user.Password, (err) => {

                if (err) {
                    res.status(401).send({ message: 'wrong password inserted' });
                    return;
                }
                res.locals.userid = _user._id;
                next();
                return;

            })
            return;
        }
        if (_err) {
            res.status(401).send({ message: "wrong Email inserted" });
        }




    });


}