const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;
const roleSchema = new Schema(
    {
        name: { type: String, required: true },
    }
);

roleSchema.plugin(AutoIncrement, { inc_field: 'roleid' });

module.exports = mongoose.model('Role', roleSchema);
