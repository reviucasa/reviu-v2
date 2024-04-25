import * as admin from "firebase-admin";
admin.initializeApp();

import {sendSignInLinkToEmail} from "./authFunctions";
import {addCustomClaim} from "./userFunctions";
import {computeWeeklyStats} from "./statsFunctions";

export {sendSignInLinkToEmail, addCustomClaim, computeWeeklyStats};
