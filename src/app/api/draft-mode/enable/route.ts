import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * The URL the Presentation tool opens to start a preview session. It validates
 * the signed `sanity-preview-*` params against the dataset before setting
 * `__prerender_bypass`, so an unsigned hit cannot turn draft mode on.
 *
 * A fresh client rather than the shared one: this needs a read token attached at
 * the point of use, and `client.ts` bakes in the Editor token used by the
 * migration scripts.
 */
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // `||`, not `??` — the read token is an empty placeholder until one is issued.
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
})

export const { GET } = defineEnableDraftMode({ client })
