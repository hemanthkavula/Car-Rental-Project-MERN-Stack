const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        userId: { type: Number, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        address: { type: String, required: true },
        password: { type: String, required: true, minLength: 6 },
        roleid: { type: String, required: true, ref: 'Role' }
    }
);

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('User', userSchema);
