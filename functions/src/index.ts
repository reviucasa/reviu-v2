import * as admin from "firebase-admin";
admin.initializeApp();

import {sendSignInLinkToEmail} from "./authFunctions";
import {addCustomClaim} from "./userFunctions";

export {sendSignInLinkToEmail, addCustomClaim};
