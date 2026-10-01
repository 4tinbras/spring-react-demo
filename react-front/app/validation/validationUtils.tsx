import * as zod from 'zod';
import {number} from 'zod';

export const ContactsValidation = zod.object({
    uuid: zod.string(),
    firstName: zod.string().nonempty(),
    lastName: zod.string().nonempty(),
    email: zod.email(),
    phoneNo: zod.string().min(6),
})

//strong typing it to ZodType<Account> causes divergence in useForm
export const accountsValidation = zod.object({
    id: zod.string(),
    ownersFirstName: zod.string().nonempty(),
    ownersSurname: zod.string().nonempty(),
    contactDetails: zod.array(number()).or(zod.string()),
    accountType: zod.string(),
    accountState: zod.string()
})