export default {
    name: 'project',
    type: 'document',
    title: 'Project',
    fields: [
      {
        name: 'projectName',
        type: 'string',
        title: 'Project Name',
        description: 'Enter the name of the project',
        validation: (Rule) => Rule.required().min(3).max(100),
      },
      {
        name: 'projectDescription',
        type: 'text',
        title: 'Project Description',
        description: 'Provide a detailed description of the project',
        validation: (Rule) => Rule.required().min(10),
      },
      {
        name: 'members',
        type: 'array',
        title: 'Project Members',
        description: 'List of members working on this project',
        of: [
          {
            type: 'reference',
            to: [{ type: 'user' }], // referring to "user" schema
          },
        ],
      },
      {
        name: 'createdAt',
        type: 'datetime',
        title: 'Created At',
        description: 'Project creation date',
        readOnly: true,
        initialValue: () => new Date().toISOString(),
      },
      {
        name: 'dueDate',
        type: 'datetime',
        title: 'Due Date',
        description: 'Deadline for the project',
      },
    ],
  };
  