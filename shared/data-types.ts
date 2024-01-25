/** https://api.opap.gr/draws/v3.0/{gameId}/{drawId} */
export interface OpapDrawV3 {
  /** Tzoker=5104 */
  gameId: number
  /** */
  drawId: number
  /** */
  drawTime: number
  /** */
  status: "results" | ""
  /** */
  drawBreak: number
  /** */
  visualDraw: number
  /** */
  pricePoints: {
    amount: number
  }
  /** */
  winningNumbers: {
    /** */
    list: number[]
    /** */
    bonus: number[]
  }
  /** */
  prizeCategories: {
    /** */
    id: number
    /** */
    divident: number
    /** */
    winners: number
    /** */
    distributed: number
    /** */
    jackpot: number
    /** */
    fixed: number
    /** */
    categoryType: number
    /** */
    gameType: string
    /** */
    minimumDistributed: string
  }[]
  /** */
  wagerStatistics: {
    /** */
    columns: number
    /** */
    wagers: number
    /** */
    addOn: unknown[]
  }
}
