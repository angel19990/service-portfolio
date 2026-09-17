function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET',
)

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-17'

/**
 * Server-only. Absent in the browser and absent during a plain `next build`,
 * so never read it at module scope in anything the client bundles.
 */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN
