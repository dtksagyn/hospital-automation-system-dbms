
# Hospital Automation System

Built with Node.js, this web app transforms hospital appointment management. Patients can easily book appointments, while doctors gain a central hub to track schedules, write diagnoses, and improve patient care efficiency.

## Watch video how does it work

(https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=9drUB1ugAQc)



![Screenshot 2024-05-06 165439](https://github.com/dtksagyn/hospital-automation-system-dbms/assets/161740245/6f5954c3-0ee4-4026-96be-53a5b31685e5)


## Prerequisites
 Node.js v20.12.2 or later - install from https://nodejs.org/
## Get Your Hospital App Running!

![Screenshot 2024-05-06 165808](https://github.com/dtksagyn/hospital-automation-system-dbms/assets/161740245/b3d46291-c203-4b0c-a690-107551dea53b)


1. Download the repository
```bash
  git clone https://github.com/margiki/NHS-nodejs-webapp
```


2. Open your terminal:

- For Linux & MacOS, use the Terminal app.
- For Windows, use PowerShell.

3. Navigate to your project folder:

Use the cd command followed by the path to your project directory. For example, if your project folder is called "hospital-app" on your desktop, you might type:

```bash
cd ~/Desktop/hospital-app
```
4. Install dependencies:

Type npm install and press Enter. This will download all the necessary tools your app needs to run.

5. Start the application:

Make sure you're still in the project folder in your terminal. Then, type node app.js and press Enter. This will launch your hospital appointment system!

6. Access the app:

Open a web browser and visit http://localhost:3000/. This should bring you to your hospital app's login page.

7. Log in:

Use username: root and password: root123 (Note: Check credentials from db.js) 

Now you should be logged in and ready to use your hospital appointment system!
## How to use it 📖

When you start the app you'll receive main page

## App Modules and Code Organisation

|  Module | Core | Doctors| Appointments|
| --- | --- | --- | --- |
| Functionality | -login system | -view Apoointments| -make an appointment|
| . | .| -write diagnosis/medicine| -print appointment|
## Code Organization

|  Folder | Content | Responsability| 
| --- | --- | --- |
|/public| |		Contains the public files, such as CSS, fonts and scripts.|
|/routes| ||Manage the HTTP requests. Is divided into smaller modules responsible for disjoint tasks|
|.|	app.js|	Renders dashboard page|
|.|/doctors.js|	Responsible for doctors|
|.|/appointmentView.js|	Responsible for appointment view|
|.|/diagnosis.js|	Responsible for  diagnosis|
|.|/appointment.js|	Responsible for appointment|
|.|/index.js|	entry point for application|
|/utils|	||	Defines the database and Schemas|
|.|/db.js|	Database settings|
|./cipher.js|For encryption/decryption passwords|  
|/views| |Render pages|
|.|	/(other files)|	Contains specific visual changes for every page|



## Technologies

### Backend
![1_TY9uBBO9leUbRtlXmQBiug](https://github.com/dtksagyn/hospital-automation-system-dbms/assets/161740245/4691dea8-9fbe-46fb-a28b-6bda3d6bc2b4)

### Frontend
![150-1506141_html-css-and-javascript-logo-html5-css3-js](https://github.com/dtksagyn/hospital-automation-system-dbms/assets/161740245/e80e6ab9-cec5-4cf5-81e0-eaf730cf72e5)

### Database Schema
![Screenshot 2024-05-06 170234](https://github.com/dtksagyn/hospital-automation-system-dbms/assets/161740245/49646dad-3573-4165-9e60-eb4cceeea5da)

