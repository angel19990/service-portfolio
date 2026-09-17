'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

/**
 * The Studio must be imported from a client boundary.
 *
 * `sanity` depends on `swr`, whose `react-server` export condition ships a
 * server-safe subset with no default export. If `sanity.config` is imported by a
 * Server Component, Next 16 resolves swr under that condition and the build
 * fails on the missing default. Keeping the config behind `'use client'` keeps
 * the whole Studio out of the RSC graph, which is where it belongs anyway.
 */
export default function Studio() {
  return <NextStudio config={config} />
}
