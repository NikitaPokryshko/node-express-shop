**Simple Courses Shop app on Node.js + Express.js**

My acquaintance with Node.js and Express.js
****
**Steps to start:**
1) You need a MongoDB remote cluster and database
2) Account in SendGrid
3) Create .env file and copy all the keys from .env.sample
4) Use you own values there
5) To run the application:
- **npm install && npm run start** => *for production*
- **npm install && npm run dev** => *for development* 
****

**Functionality:**
- Sign in / Sign up logic with session
- Cart / Orders
- Creating / editing / deleting a course
- User profile
- Password encryption
- Password restoring via emails (with SendGrid service)
- File uploading(for avatars) to the *images* folder
- Client side / Server side validation
- **CSRF** token protection
- **Handlebars** for views
- Static files compression
- **Helmet** for additional headers
- Separated configs for *dev* and *production* modes
****
