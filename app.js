const express = require('express');
const bodyParser = require('body-parser');

const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes')
const departmentRoutes = require('./routes/departmentRoutes')
const session = require('express-session');

const sequelize = require('./utils/db');
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express();

// Set EJS as the view engine

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'ejs');


/*
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure:true if using HTTPS
}));
*/
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser('cookie_secret'))
// Routes
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/departments', departmentRoutes);

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));




// Start server
const PORT = process.env.PORT || 3000;

// Sync the database before starting the server
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();


