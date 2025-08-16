const joi = require("joi");
const validator = require("express-joi-validation").createValidator({
      passError: true,
});

exports.registerVal = validator.body(joi.object({
      name: joi.string().min(3).max(50).required().messages({}),
}),{
      joi: {
            convert: false,
            allowUnknown: false,
      },
});
