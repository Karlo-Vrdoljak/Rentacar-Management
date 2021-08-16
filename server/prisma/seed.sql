-- SQLite
drop table if exists user;

CREATE TABLE if not exists user(
  pkUser INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  email TEXT unique,
  name TEXT,
  lastName TEXT,
  phone TEXT,
  address TEXT,
  claims TEXT default ('user'),
  password Text NOT NULL
);

drop table if exists vehicleStatus;

create table if not exists vehicleStatus (
  pkVehicleStatus INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  name TEXT NOT NULL
);

drop table if exists vehicle;

CREATE table if not exists vehicle(
  pkVehicle INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  manufacturer Text NOT NULL,
  model Text NOT NULL,
  dateOfManufacture DATETIME,
  startingKilometers Text NOT NULL,
  currentKilometers Text NOT NULL,
  gasType Text NOT NULl,
  color Text NOT NULl,
  pkStatus INT REFERENCES vehicleStatus(pkVehicleStatus),
  code TEXT NOT NULL
);

drop table if exists rentStatus;

CREATE TABLE if not exists rentStatus(
  pkRentStatus INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  name TEXT NOT NULL
);

drop table if exists rent;

CREATE TABLE if not exists rent(
  pkRent INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  pkVehicle INT REFERENCES vehicle(pkVehicle),
  pkUserEntry INT REFERENCES user(pkUser),
  pkUserRented INT REFERENCES user(pkUser),
  pkRentStatus INT REFERENCES rentStatus(pkRentStatus),
  rentFrom DATETIME NOT NULL,
  rentTo DATETIME NOT NULL,
  rentCompleteKilometers TEXT,
  pickupLocation TEXT NOT NULL,
  dropOffLocation TEXT
);

drop table if exists receiptStatus;

CREATE TABLE if not exists receiptStatus(
  pkReceiptStatus INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  name TEXT NOT NULL
);

drop table if exists receipt;

CREATE TABLE if not exists receipt(
  pkReceipt INTEGER PRIMARY KEY,
  createdAt DATETIME NOT NULL DEFAULT current_timestamp,
  changedAt DATETIME NOT NULL DEFAULT current_timestamp,
  pkRent INT REFERENCES rent(pkRent),
  price TEXT NOT NULL,
  currencyCode TEXT NOT NULL,
  dateDue DATETIME NOT NULL DEFAULT (datetime('now', '1 month')),
  pkReceiptStatus INT REFERENCES rentStatus(pkRentStatus),
  isPaid INT DEFAULT (0)
);

insert into
  user (
    email,
    name,
    lastName,
    phone,
    address,
    claims,
    password
  )
values
  (
    'karlo.vrdoljak@gmail.com',
    'Karlo',
    'Vrdoljak',
    '0958947680',
    'Ruđera Boškovića 15',
    'user,employed,admin',
    '$2b$10$ZaGmKla0WGIb4HM8p6LdceuZLqSXJaRytO1uEdUAgDWTWdRAEzIhe'
  ),
  (
    'lucija.grabovac@gmail.com',
    'Lucija',
    'Grabovac',
    null,
    null,
    'user',
    '$2b$10$ZaGmKla0WGIb4HM8p6LdceuZLqSXJaRytO1uEdUAgDWTWdRAEzIhe'
  );

insert into
  vehicleStatus(name)
values
  ('Service'),
  ('Available'),
  ('Rented'),
  ('Not available');

insert into
  vehicle(
    manufacturer,
    model,
    dateOfManufacture,
    startingKilometers,
    currentKilometers,
    gasType,
    color,
    pkStatus,
    code
  )
values
  (
    'Opel',
    'Astra J 2.0 CDTI',
    '2016-03-11 00:00:00',
    '145000',
    '145000',
    'Diesel',
    'Red',
    3,
    'OA1'
  ),
  (
    'Opel',
    'Astra J 2.0 CDTI',
    '2016-03-11 00:00:00',
    '48000',
    '152000',
    'Diesel',
    'Red',
    2,
    'OA2'
  );

insert into
  rentStatus (name)
VALUES
  ('Queued'),
  ('Started'),
  ('Complete'),
  ('Late');

insert into
  rent (
    pkVehicle,
    pkUserEntry,
    pkUserRented,
    pkRentStatus,
    rentFrom,
    rentTo,
    rentCompleteKilometers,
    pickupLocation,
    dropOffLocation
  )
values
  (
    1,
    1,
    2,
    3,
    '2020-06-01 11:00:00',
    '2020-06-11 11:00:00',
    '150000',
    'Split 3',
    'Split 3'
  ),
  (
    1,
    1,
    2,
    3,
    '2020-07-01 11:00:00',
    '2020-07-12 11:00:00',
    '152000',
    'Split 3',
    'Split 3'
  ),
  (
    1,
    1,
    2,
    2,
    '2020-08-01 11:00:00',
    '2020-09-08 11:00:00',
    null,
    'Split 3',
    null
  );

insert into
  receiptStatus (name)
VALUES
  ('Waiting'),
  ('Paid'),
  ('Late');

insert into
  receipt(pkRent, price, currencyCode, pkReceiptStatus)
values
  (1, '1940.00', 'HRK', 3),
  (2, '2140.00', 'HRK', 2);