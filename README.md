
# Setup
## env. variables
`.env.local`
provide mail provider & creadentials
example:

```bash
# Auth

NEXTAUTH_URL=http://localhost:3000/api/auth

NEXTAUTH_SECRET=123A23424FDFSD2234242R243243CVF323423C324234

# Mail

EMAIL_SERVER=smtp://examplev@example.com:asdfghjkl@smtp.example.com:587

```
`.env`
provide db url
example:
```bash
DATABASE_URL="mysql://root:root@localhost:3306/chat-app"
```

## Setup prisma
```bash
npm run DB:Migrate
npm run DB:Generate
```
## Running server
```bash
	npm run build
	npm run start
```
