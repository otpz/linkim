
# Linkim

linkim is a social media referance landing page.

## Stage : Development

## Installation
In order to install and use the project, you need to import the following .sql file to your database.

[Uploading script.sql…]()


### .env File
You need to create a .env file into server file like;

```.env
DB = database name
DB_SERVER = database server name
PORT = server port number like 3000, 5000 etc.
SESSION_SECRET = random text like 2832832182
GOOGLE_SECRET = you need to get a secret key from Google for reCAPTCHA.
CSRF_SECRET = random text like 23jdkq2931skd12
CSRF_COOKIE_NAME = x-csrf-token 
```

### Clone the Project and Install Packages
First, create a new file and write this command to terminal.
```bash
git clone https://github.com/otpz/linkim.git
```
After the project is cloned, perform the following steps.
```bash
cd linkim 
cd server
```
Finally, after making sure that the server file is entered, run the command below.
```bash
npm install
```
In this way, all packages of the project will be installed.

### Run Project
* Enter the server file,
```bash
cd linkim 
cd server
```
* Run the command below for stand up the server,
```bash
npm run start
```
* Run the command below for start tailwind.css ,
```bash
npm run watch
```
Finally, type ``` http://localhost:YOUR_PORT_NUMBER``` into your browser's URL bar.

You can use the website now.
