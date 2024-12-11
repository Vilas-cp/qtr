export default {
    name: 'user',
    type: 'document',
    title: 'User',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Full Name',
        description: 'Enter the full name of the user',
        validation: (Rule) => Rule.required().min(3).max(100),
      },
      {
        name: 'email',
        type: 'string',
        title: 'Email',
        description: 'User’s email address',
        validation: (Rule) => Rule.required().email(),
      },
      {
        name: 'role',
        type: 'string',
        title: 'Role',
        description: 'The role of the user in the system',
        options: {
          list: [
            { title: 'Admin', value: 'admin' },
            { title: 'Member', value: 'member' },
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'profilePicture',
        type: 'image',
        title: 'Profile Picture',
        description: 'Upload a profile picture for the user',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'joinedAt',
        type: 'datetime',
        title: 'Joined At',
        description: 'Date when the user joined the system',
        readOnly: true,
        initialValue: () => new Date().toISOString(),
      },
    ],
  };
  