const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const passwordGenerator = require("../helpers/passwordGenerator.js");
const uniqueID = require("../helpers/uniqueID");
const apiResponse = require("../helpers/apiResponse");


const createUser = async (req, res) => {
  
  const { 
    fullName, 
    email, 
    mobileno, 
    dateOfBirth,
    weight,
    height,    
} = req.body;



try {
// See if user exists
let user = await User.findOne({ email });

    if (user) {
      apiResponse.AlreadyExists(res,"User already exists",{user : user?.fullName});
      return 0; 
    }

    // generating user unique gym id
    var gym_id = await uniqueID.generateID();
    var password = await passwordGenerator.generateRandomPassword();

 

    user = new User({
        gym_id,
        fullName, 
        email, 
        password,  
        mobileno, 
        dateOfBirth,
        weight,
        height, 
    });

    //console.log("user",user);

    //Encrypt Password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    
    apiResponse.Success(res,"Add New User Success",{user: user});

    } catch (err) {
    console.error(err);
    apiResponse.ServerError(res,"Server Error",{err:err});
    }
};





const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    apiResponse.Success(res,"All Users Retrive Success",{users: users });
  } catch (error) {
    apiResponse.ServerError(res,"Server Error",{err:error});
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    apiResponse.Success(res,"All Users Retrive Success",{users: users });
  } catch (error) {
    apiResponse.ServerError(res,"Server Error",{err:error});
  }
};



const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, mobileno, email , dateOfBirth ,  weight ,height  } = req.body;

  const filter = { _id: id };
  const update = { 
       fullName: fullName,
       mobileno:mobileno,
       email : email,
       dateOfBirth : dateOfBirth,
       weight : weight,
       height : height      
      };

  try {
  
  let data = await User.findOneAndUpdate(filter, update);
  console.log(data);
  apiResponse.Success(res,"User Details Updated", {data:data});

  } catch (error) {
    apiResponse.ServerError(res,"Server Error",{err:error});
  }
}


const deleteUser = async (req, res) => {
  const { id } = req.params;

  let data = await User.findByIdAndRemove(id);

  apiResponse.Success(res, "User Deleted", {data:data});
}



module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
