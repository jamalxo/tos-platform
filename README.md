# Connotate - Analyze ToS documents together
<table>
<tr>
<td>

-  [**Angular 11.0.0**](https://github.com/angular/angular/releases) & [**Angular CLI 11.0.1**](https://github.com/angular/angular-cli/releases/) as Client
- Nodejs as Backend with Express for API calls
- MongoDB as DB
- Material for the UI
</td>
</tr>
</table>

# Features
- Login/Register
- Homepage
- Editor
    - Upload documents (pdf or text)
    - Create sections in documents
    - Annotate, upvote and comment sections
- Create, manage and assign tasks
- View all tasks in TaskList
- View all tasks in DocumentList
- Password reset feature
- About-us page
- Edit your profile

# Future Work
- Recent Swimlane in Homepage

# How to use
1) Upload document(s) in the Homepage
2) It will redirect you to the editor, but is also accessible from the sidebar in the DocumentList
3) Start creating sections by marking some part of the text with your mouse and releasing again
4) A dialog should open, where you have to option to annotate that section

# How to setup

# Client
cd client/tos
npm install  
ng serve

# Server
rename env.example to env in root

cd server  
npm install  
node index.js

# Database
runs on a cloud, no configuration needed

# Database Content
download Mongo Compass and connect to mongodb+srv://admin:tos123@tos-db.e9p2p.mongodb.net/test

### Disclaimer
All icons that have been used are from icons8.com or flaticon.com and may be subject to copyright.
Also icons from material icons
