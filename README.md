
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


## Local test

curl -X POST http://localhost:3000/api/tasks/generate \
-H "Content-Type: application/json" \
-d '{"feature":"Write a simple js function that takes in 2 int and return their sum"}'