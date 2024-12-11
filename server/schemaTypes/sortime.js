export default {
    name: 'tasksort',
    type: 'document',
    title: 'Task Sorting',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Task Title',
        description: 'Enter a short title for the tasksort',
        validation: (Rule) => Rule.required().min(3).max(100),
      },
      {
        name: 'description',
        type: 'text',
        title: 'Task Description',
        description: 'Detailed description of the task',
      },
      {
        name: 'status',
        type: 'string',
        title: 'Status',
        description: 'Current status of the task',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'In Progress', value: 'in_progress' },
            { title: 'Completed', value: 'completed' },
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'dueDate',
        type: 'datetime',
        title: 'Due Date',
        description: 'Deadline for the task',
      },
      {
        name: 'priority',
        type: 'string',
        title: 'Priority',
        description: 'Priority level of the task',
        options: {
          list: [
            { title: 'Low', value: 'low' },
            { title: 'Medium', value: 'medium' },
            { title: 'High', value: 'high' },
          ],
        },
      },
      {
        name: 'timeAllocation',
        type: 'number',
        title: 'Time Allocation (minutes)',
        description: 'Suggested focus time for this task in minutes',
        validation: (Rule) => Rule.required().min(5).max(240),
      },
      {
        name: 'assignedTo',
        type: 'reference',
        title: 'Assigned To',
        description: 'Person responsible for the task',
        to: [{ type: 'user' }], // Assuming you have a "user" schema
      },
      {
        name: 'createdAt',
        type: 'datetime',
        title: 'Created At',
        description: 'Task creation date',
        readOnly: true,
        initialValue: () => new Date().toISOString(),
      },
    ],
  };
  