import * as admin from "firebase-admin";
admin.initializeApp();

import {sendSignInLinkToEmail} from "./authFunctions";
import {addCustomClaim} from "./userFunctions";
import {computeWeeklyStats} from "./statsFunctions";
import {sendNewReportNotification} from "./reportsFunctions";

export {
  sendSignInLinkToEmail,
  addCustomClaim,
  computeWeeklyStats,
  sendNewReportNotification,
};
