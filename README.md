This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## .env setup
First create a .env.local file in root of project
then add the following constants
```
MONGODB_URI = "mongodb://localhost:27017/YOUR_DB_NAME"
JWT_SECRET="YOUR_SECRET_KEY"