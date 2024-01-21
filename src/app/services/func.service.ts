import { Injectable } from '@angular/core';
import { User } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AppService } from './app.service';
import { FireService } from './fire.service';
//#region Types
/** Global Rights in custom claims */
export interface RightsGlobal {
  /** Dashboard: Console v3+ */
  Admin?: boolean
  /** Show Debug Options v3+ */
  Debug?: boolean
  /** Provider: Rights v3+ */
  Data?: { [providerUID: string]: RightsProviderAuth }
}
/** Provider Basic Rights in custom claims */
export interface RightsProviderAuth {
  /** Admin-only features */
  Admin?: boolean
  /** Dashboard: Staff */
  Staff?: boolean
  /** Dashboard: Agent */
  Agent?: boolean
}
/** */
export type fireUserRemote = User & { customClaims: RightsGlobal | undefined, disabled?: boolean, metadata?: { lastRefreshTime?: string } }
//#endregion
/** Firebase Functions */
@Injectable({
  providedIn: 'root'
})
export class FuncService {
  /** */
  functions = getFunctions(this.fireService.app)
  /** */
  constructor(
    public appService: AppService,
    public fireService: FireService
  ) { }
  /** General cloud function caller */
  cloudFunction<T>(name: string, data: any = {}): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      httpsCallable(this.functions, name)(data).then(result => {
        resolve(result.data as T)
      }).catch(reason => {
        this.appService.showMessage(`Cloud Function ${name} Error: ${reason?.message}`)
        resolve(undefined)
      })
    })
  }
  /** */
  getUsers = async (UIDs?: string[], emails?: string[], pageToken?: string) => (await this.cloudFunction<{
    users?: fireUserRemote[],
    pageToken?: string,
    error?: string
  }>("getUsers", {
    UIDs: UIDs,
    emails: emails,
    pageToken: pageToken
  }))
  /** */
  setDisplayName = async (userUID: string, userName: string) => (await this.cloudFunction<{ message?: string, error?: string }>("setDisplayName", {
    userUID: userUID,
    userName: userName
  }))
  /** */
  setCustomClaims = async (userEmail: string, userClaims: any, providerUID: string) => (await this.cloudFunction<{ message?: string, error?: string }>("setCustomClaims", {
    userEmail: userEmail,
    userClaims: userClaims,
    providerUID: providerUID
  }))
  /** */
  resetAdminClaims = async () => (await this.cloudFunction<{ message?: string, error?: string }>("resetAdminClaims"))
}
