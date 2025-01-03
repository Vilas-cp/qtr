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
      validation: (Rule) => Rule.required().min(3),
    },
    {
      name: 'members',
      type: 'array',
      title: 'Project Members',
      description: 'List of members working on this project',
      of: [
        {
          type: 'reference',
          to: [{ type: 'user' }],
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: 'tasks',
      type: 'array',
      title: 'Project Tasks',
      description: 'Tasks specific to this project',
      of: [
        {
          type: 'object',
          title: 'Task',
          fields: [
            {
              name: 'taskTitle',
              type: 'string',
              title: 'Task Title',
              description: 'The name of the task.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'taskId',
              type: 'string',
              title: 'Task ID',
              initialValue: () => `task_${Math.random().toString(36).substr(2, 9)}`, // Auto-generate taskId
              readOnly: true,
            },
           
            {
              name: 'taskDescription',
              type: 'text',
              title: 'Task Description',
              description: 'Details about the task.',
            },
            {
              name: 'priority',
              type: 'string',
              title: 'Task Priority',
              options: {
                list: [
                  { title: 'High', value: 'high' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Low', value: 'low' },
                ],
              },
              description: 'Set the priority level of the task.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'status',
              type: 'string',
              title: 'Status',
              options: {
                list: [
                  { title: 'Pending', value: 'pending' },
                  { title: 'Completed', value: 'completed' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'assignedTo',
              type: 'reference',
              title: 'Assigned To',
              description: 'Assign this task to a project member',
              to: [{ type: 'user' }],
              options: {
                filter: ({ document }) => {
                  return {
                    filter: '_id in $members',
                    params: {
                      members: document?.members?.map((member) => member._ref) || [],
                    },
                  };
                },
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'dueDate',
              type: 'datetime',
              title: 'Task Due Date',
              description: 'Deadline for this task',
            },
          ],
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

