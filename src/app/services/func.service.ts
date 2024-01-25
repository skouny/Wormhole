import { Injectable } from '@angular/core';
import * as auth from "firebase/auth";
import * as functions from "firebase/functions";
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
export type fireUserRemote = auth.User & { customClaims: RightsGlobal | undefined, disabled?: boolean, metadata?: { lastRefreshTime?: string } }
//#endregion
/** Firebase Functions */
@Injectable({
  providedIn: 'root'
})
export class FuncService {
  /** */
  functions = functions.getFunctions(this.fireService.app)
  /** */
  constructor(
    public appService: AppService,
    public fireService: FireService
  ) { }
  /** General cloud function caller */
  cloudFunction<T>(name: string, data: any = {}): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      functions.httpsCallable(this.functions, name)(data).then(result => {
        resolve(result.data as T)
      }).catch(reason => {
        this.appService.showMessage(`Cloud Function ${name} Error: ${reason?.message}`)
        resolve(undefined)
      })
    })
  }
  /** */
  cloudFunctionURL<T>(url: string, data: any = {}): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      functions.httpsCallableFromURL(this.functions, url)(data).then(result => {
        resolve(result.data as T)
      }).catch(reason => {
        this.appService.showMessage(`Cloud Function ${url} Error: ${reason?.message}`)
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
  updateOpapV3 = async (gameId: number, drawId: number) => (await this.cloudFunctionURL<string>("https://updateopapv3-z4n2whrlyq-ey.a.run.app", { gameId: gameId, drawId: drawId }))
  /** */
  updateOpapQuickV3 = async (gameId: number) => (await this.cloudFunctionURL<string>("https://updateopapquickv3-z4n2whrlyq-ey.a.run.app", { gameId: gameId }))
  /** */
  updateOpapAllV3 = async (gameId: number, drawId = 0) => (await this.cloudFunctionURL<string>("https://updateopapallv3-z4n2whrlyq-ey.a.run.app", { gameId: gameId, drawId: drawId }))
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
