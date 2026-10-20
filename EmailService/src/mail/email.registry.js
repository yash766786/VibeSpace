import { EMAIL_TYPES } from "../utils/email.constants.js";

import { registerTemplate } from "./templates/register.template.js";
import { passwordResetTemplate } from "./templates/password-reset.template.js";
import { welcomeTemplate } from "./templates/welcome.template.js";


const EMAIL_REGISTRY = {
    [EMAIL_TYPES.REGISTER]: registerTemplate,
    [EMAIL_TYPES.PASSWORD_RESET]: passwordResetTemplate,
    [EMAIL_TYPES.WELCOME]: welcomeTemplate
};


const getEmailTemplate = (emailType) => {
    const template = EMAIL_REGISTRY[emailType];

    if (!template) {
        throw new Error(`Unsupported email type: ${emailType}`);
    }

    return template;
};

export { getEmailTemplate };