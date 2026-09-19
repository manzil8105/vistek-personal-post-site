# My Personal blog site 

It's a personal portfolio and Content Management System built with Next.js, Drizzle ORM, and PostgreSQL. Features a custom Markdown engine, secure "Phantom Protocol" admin routing, and a terminal-inspired UI, to write down my thoughts and write about interesting things that I learn every day. 


## TechStack
* **Framework:** Next.js (App Router)
* **Database:** PostgreSQL (via Supabase)
* **ORM:** Drizzle ORM
* **Styling:** Tailwind CSS
* **Authentication:** `bcrypt` (Hashing) & `jose` (JWT)



## Prerequisites
Before activating the system, make sure the following stuff are installed:

1. Node.js (v18 or higher)
2. Git
3. A PostgreSQL database (e.g., Neon, Supabase, or local Postgres)

## System Activation
Clone the repository to local machine and install the required dependencies:

```
git clone https://github.com/manzil8105/vistek-personal-site.git
cd vistek-personal-site
npm install

```


## Environment Configuration
This system uses a "Secret Knock" protocol to hide the admin dashboard from the public. environment variables must  be set up locally.

Make a file named .env in the root of the project and add the following keys:
 ```
 # PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:port/dbname

 # A secure random string for signing admin sessions
JWT_SECRET=generate_a_random_secure_string_here

 # The secret phrase required to access the hidden login page
ADMIN_SECRET_KEY=cyberpunk-2026
 ```

( The .env file is intentionally ignored by Git to protect credentials). 

## Database Setup
Because this system uses a "Phantom Protocol" for security, there is no public "Sign Up" page,  the database must be manually initialized and inject the first root admin directly into the Supabase server.

### Phase 1
go to Supabase and click New Project.
Select organization, then name the project.
Create a  Database Password. Save this password somewhere safe; it will be needed it in Phase 2. 
Select a region closest and click Create new project.
Wait 2-3 minutes. 

### Phase 2
In Supabase dashboard, go to the Project Settings 
Click on Database in the sidebar menu.
Scroll down to the Connection string section and select the URI tab.
Copy the provided URL. It will look kinda like this:
postgresql://postgres.your_project_ref:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
Open local .env file, paste it as DATABASE_URL.
Replace the [YOUR-PASSWORD] bracket with the actual database password 

### Phase 3: Push the Schema
tables must be built (Posts, Tags, PostTags, Admins) in the database before the system can function. two way: automatically via the terminal, or manually via the Supabase SQL Editor.

### Option A: Automated (Terminal)
Run the Drizzle ORM push command to automatically read `schema.ts` file and create the tables:
```bash
npx drizzle-kit push
```

### Option B: Manual (SQL Editor)

go to the **SQL Editor** in the Supabase dashboard, click **New Query**, paste the following SQL, and click **Run**:

SQL

```
CREATE TABLE IF NOT EXISTS "admins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "username" varchar(255) NOT NULL UNIQUE,
  "passwordHash" varchar(255) NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "contentHtml" text NOT NULL,
  "thumbnailUrl" varchar(512),
  "isDraft" boolean DEFAULT true NOT NULL,
  "readTimeMinutes" integer DEFAULT 1 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "postTags" (
  "postId" uuid NOT NULL REFERENCES "posts"("id") ON DELETE cascade,
  "tagId" uuid NOT NULL REFERENCES "tags"("id") ON DELETE cascade,
  CONSTRAINT "postTags_pk" PRIMARY KEY("postId","tagId")
);
```

## Phase 4 for high level security 

1. Go to a secure hash generator like Bcrypt-Generator.com. 
2. Type desired admin password into the String box (like MySuperSecretPassword2026). 
3. Set the Rounds to 10. 
4. Click Encrypt and copy the resulting hash.
5. It will look like a random string of characters (like this 2a10$X8...)

## Phase 5: 
Go back to Supabase dashboard. 
Click on the Table Editor icon in the left sidebar (the menu icon with lines and squares).
Select the admins table from the list.
Click the green Insert row button in the top right corner.
Fill out the fields: 
	id: Leave this blank (Supabase will auto-generate the UUID). 
	username: Enter desired login name (e.g., manzil8105). 
	passwordHash: Paste the encrypted Bcrypt string which was generated in Phase 4. createdAt: Leave this as now() (or select the current date/time). 
	Click Save.

## Local Run: 
boot up local server, type (npm run dev) in terminal
navigate to Secret Knock URL (localhost:3000/gateway-override?key=secret key), 
and log in using new username and the original raw password. 
Navigate to http://localhost:3000 for public feed.
