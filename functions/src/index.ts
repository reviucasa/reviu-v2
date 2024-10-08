import * as admin from "firebase-admin";
admin.initializeApp();

import {sendSignInLinkToEmail} from "./authFunctions";
import {addCustomClaim} from "./userFunctions";
import {computeWeeklyStats} from "./statsFunctions";
import {onReportCreated} from "./reportsFunctions";

export {
  sendSignInLinkToEmail,
  addCustomClaim,
  computeWeeklyStats,
  onReportCreated,
};
