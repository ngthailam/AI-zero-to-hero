
## Structure

ai-task-generator/
│
├── src/
│   ├── index.js          # Express app
│   ├── ai/
│   │   ├── client.js     # OpenAI setup
│   │   ├── prompts.js    # prompt templates
│   │   └── generator.js  # main logic
│   │
│   ├── schemas/
│   │   └── taskSchema.js # validation
│   │
│   └── routes/
│       └── taskRoutes.js
│
├── .env
├── package.json
└── README.md