import type { StructureResolver } from 'sanity/structure'
import { PAGE_ROUTES } from './lib/routes'

const SERVICES = [
  { id: 'service-ux', title: 'UX & Product Design' },
  { id: 'service-video', title: 'Creative Video Production' },
] as const

/**
 * Pages and services are pinned singletons: the route knows its document, so
 * an editor can never create a second home page. Projects are a free list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              PAGE_ROUTES.map(({ id, title }) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  .child(S.document().schemaType('page').documentId(id).title(title)),
              ),
            ),
        ),
      S.divider(),
      S.listItem()
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Services')
        .child(
          S.list()
            .title('Services')
            .items(
              SERVICES.map(({ id, title }) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  .child(S.document().schemaType('service').documentId(id).title(title)),
              ),
            ),
        ),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(S.document().schemaType('navigation').documentId('navigation')),
    ])
