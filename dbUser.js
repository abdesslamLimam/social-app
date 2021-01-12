import mongoose from 'mongoose';


const user = mongoose.Schema({
    name: String,
    username:String,
    password:String,
    email: String,
});

export default mongoose.model('user',user)