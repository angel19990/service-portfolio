import { defineType, defineField, defineArrayMember } from 'sanity'

export const imageMedia = defineType({
  name: 'imageMedia',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'What the image shows. Leave blank only if it is purely decorative.',
      validation: (R) =>
        R.custom((alt, ctx) =>
          (ctx.parent as { decorative?: boolean })?.decorative || alt
            ? true
            : 'Alt text is required unless the image is marked decorative.',
        ),
    }),
    defineField({
      name: 'decorative',
      title: 'Decorative (alt="")',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({
      name: 'fit',
      type: 'string',
      initialValue: 'contain',
      options: { list: ['contain', 'cover'], layout: 'radio', direction: 'horizontal' },
    }),
  ],
})

/**
 * A clip can come from either place: uploaded straight into Sanity (`file`,
 * the editor-friendly path) or hosted elsewhere and referenced by URL
 * (`mp4Url`, for large files on a dedicated video host). One of the two is
 * required; the poster always is, because reduced-motion visitors see it
 * instead of the clip.
 */
export const videoMedia = defineType({
  name: 'videoMedia',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'file',
      title: 'Video file',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      description: 'Upload an MP4 (H.264) or WebM. Keep short loops small; long pieces belong on a video host with the URL below.',
    }),
    defineField({
      name: 'mp4Url',
      title: 'MP4 URL (alternative to upload)',
      type: 'url',
      validation: (R) =>
        R.custom((url, ctx) => {
          const parent = ctx.parent as { file?: { asset?: unknown } } | undefined
          return url || parent?.file?.asset ? true : 'Upload a file or provide an MP4 URL.'
        }),
    }),
    defineField({ name: 'webmUrl', title: 'WebM URL (optional, served first)', type: 'url' }),
    defineField({
      name: 'poster',
      title: 'Poster frame',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown before play and for reduced-motion users.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Description',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'aspect',
      type: 'string',
      initialValue: '16/9',
      options: { list: ['16/9', '9/16', '4/3', '1/1', '3/2', '2/1', '21/9'] },
    }),
    defineField({
      name: 'controls',
      title: 'Something to watch, not something to have on',
      type: 'boolean',
      initialValue: false,
      description:
        'Off: a short silent loop that plays and pauses by scrolling. On: native controls, no loop, no autoplay; right for a finished piece with a beginning and an end.',
    }),
    defineField({ name: 'caption', type: 'string' }),
  ],
  preview: {
    select: { title: 'alt', media: 'poster' },
    prepare: ({ title, media }) => ({ title: title ?? 'Video', subtitle: 'Video', media }),
  },
})

const mediaMembers = [defineArrayMember({ type: 'imageMedia' }), defineArrayMember({ type: 'videoMedia' })]

/**
 * A single image-or-video field, declared once.
 *
 * An array with `max(1)` rather than a union object: Sanity has no first-class
 * "one of these types" field, and an array of one is the idiom that gives the
 * editor the type picker. Never required: every slot on this site renders
 * nothing when empty so a page can go live before its media is ready.
 */
export function mediaSlot(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: 'array',
    of: mediaMembers,
    validation: (R) => R.max(1),
  })
}

/** A gallery: any number of images and videos. */
export function mediaList(name: string, title: string, max = 24, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: 'array',
    of: mediaMembers,
    validation: (R) => R.max(max),
  })
}
