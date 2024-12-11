import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'devtask',

  projectId: '9quolbjs',
  dataset: 'stellar',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
