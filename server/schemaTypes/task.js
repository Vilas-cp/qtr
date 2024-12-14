export default {
  name: 'task',
  type: 'document',
  title: 'Task',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Task Title',
      description: 'The name of the task.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Task Description',
      description: 'Details about the task.',
    },
    {
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'dueDate',
      type: 'datetime',
      title: 'Due Date',
      description: 'Optional: Deadline for the task.',
    },
    {
      name: 'pomodoroSettings',
      type: 'object',
      title: 'Pomodoro Settings',
      fields: [
        {
          name: 'workDuration',
          type: 'number',
          title: 'Work Duration (minutes)',
          validation: (Rule) => Rule.min(1).max(60).required(),
        },
        {
          name: 'breakDuration',
          type: 'number',
          title: 'Break Duration (minutes)',
          validation: (Rule) => Rule.min(1).max(30).required(),
        },
        {
          name: 'longBreakDuration',
          type: 'number',
          title: 'Long Break Duration (minutes)',
          validation: (Rule) => Rule.min(1).max(60),
        },
        {
          name: 'cycles',
          type: 'number',
          title: 'Number of Cycles',
          description: 'Number of Pomodoro cycles before a long break.',
          validation: (Rule) => Rule.min(1).max(10),
        },
      ],
    },
  ],
};
