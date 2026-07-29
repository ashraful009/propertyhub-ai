const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
require('express-async-errors');

const errorHandler = require('./middleware/error.middleware');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); 
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 150, 
  message: { success: false, message: 'Too many requests from this IP, please try again after 10 minutes' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(mongoSanitize()); 
app.use(xss()); 
app.use(hpp()); 

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FlatSell API is running ' });
});

app.use('/api/auth',       require('./features/shared/auth/auth.routes'));
app.use('/api/policies',   require('./features/shared/policies/policy.routes'));
app.use('/api/companies',  require('./features/shared/companies/company.routes'));
app.use('/api/properties', require('./features/shared/properties/property.routes'));
app.use('/api/units',      require('./features/shared/units/unit.routes'));

app.use('/api/bookings',   require('./features/shared/bookings/booking.routes'));
app.use('/api/checkout',          require('./features/customer/checkout/checkout.routes'));
app.use('/api/booking-policies',  require('./features/shared/policies/bookingPolicy.routes'));
app.use('/api/commissions',       require('./features/admin/commissions/commission.routes'));
app.use('/api/installments',      require('./features/customer/installments/installment.routes'));
app.use('/api/settings',          require('./features/admin/settings/platformSettings.routes'));
app.use('/api/refunds',           require('./features/admin/refunds/refund.routes'));
app.use('/api/admin',             require('./features/admin/dashboard/admin.routes'));
app.use('/api/chatbot',           require('./features/shared/chatbot/chatbot.routes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
