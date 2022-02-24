import { ChainTypes } from '@shapeshiftoss/types'
import { GemManager } from 'features/buysell/providers/gem/GemManager'
import React from 'react'
import { Route, useLocation } from 'react-router-dom'

import { BuySellModal } from '../../components/BuySellModal/BuySellModal'
import { BuySellProviders } from '../../components/BuySellProviders/BuySellProviders'

export enum BuySellProvider {
  Gem = 'gem',
  OnJuno = 'onjuno'
}

export enum BuySellAction {
  Buy = 'buy',
  Sell = 'sell'
}

export type BuySellParams = {
  provider: BuySellProvider
  action: BuySellAction
}

export type BuySellQueryParams = {
  chain: ChainTypes
  contractAddress: string
  tokenId?: string
}

export type BuySellAsset = {
  created_at: string
  external_id: string
  gem_asset_id: string
  mapping_id: string
  name: string
  primary_color: string
  rank: number
  resolved: boolean
  source: string
  ticker: string
  transaction_fields: Object
  updated_at: string
}

type BuySellManagerProviderProps = {
  children: React.ReactNode
}

type BuySellManagerContextProps = {
  open(): void
  close(): void
}

const BuySellManagerContext = React.createContext<BuySellManagerContextProps | null>(null)

const BuySellModules = {
  [BuySellProvider.Gem]: GemManager,
  [BuySellProvider.OnJuno]: null
}

export function BuySellManagerProvider({ children }: BuySellManagerProviderProps) {
  const location = useLocation<{ background: any }>()
  const background = location.state && location.state.background
  return (
    <BuySellManagerContext.Provider value={null}>
      {children}
      {background && (
        <Route
          path='/buysell/:provider?/:action?'
          render={({ match: { params } }) => {
            const { provider } = params as { provider: BuySellProvider }
            const Module = BuySellModules[provider as BuySellProvider]
            return <BuySellModal>{Module ? <Module /> : <BuySellProviders />}</BuySellModal>
          }}
        />
      )}
    </BuySellManagerContext.Provider>
  )
}