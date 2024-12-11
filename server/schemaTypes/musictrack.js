// schemas/musicTrack.js
export default {
    name: 'musicTrack',
    type: 'document',
    title: 'Music Track',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Track Title',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'artist',
        type: 'string',
        title: 'Artist',
      },
      {
        name: 'url',
        type: 'url',
        title: 'Track URL',
        description: 'URL of the music track for streaming.',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'genre',
        type: 'string',
        title: 'Genre',
        options: {
          list: [
            { title: 'Lo-fi', value: 'lofi' },
            { title: 'Classical', value: 'classical' },
            { title: 'Nature Sounds', value: 'nature' },
            { title: 'Instrumental', value: 'instrumental' },
          ],
        },
      },
    ],
  };
  