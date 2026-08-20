/* =========================================================
   ATP FLEET MANAGEMENT
   DATA.JS
   DEFAULT VEHICLE DATABASE
   ========================================================= */

"use strict";


/* =========================================================
   VEHICLE TYPES
   ========================================================= */

const VEHICLE_TYPES = {

    PRIVATE: "PRIVATE",

    TRUCKS: "TRUCKS",

    EQUIPMENT: "EQUIPMENT",

    SPECIAL: "SPECIAL",

    GENERATORS: "GENERATORS"

};


/* =========================================================
   VEHICLE STATUS
   ========================================================= */

const VEHICLE_STATUS = {

    WORKING: "working",

    DEFECTIVE: "defective",

    STOPPED: "stopped"

};


/* =========================================================
   DRIVER STATUS
   ========================================================= */

const DRIVER_STATUS = {

    PRESENT: "present",

    ABSENT: "absent",

    SICK: "sick",

    ANNUAL: "annual"

};


/* =========================================================
   MAINTENANCE STATUS
   ========================================================= */

const MAINTENANCE_STATUS = {

    NONE: "none",

    PERIODIC: "periodic",

    EMERGENCY: "emergency"

};


/* =========================================================
   VEHICLE FACTORY
   ========================================================= */

function createVehicle(
    id,
    number,
    type,
    driver,
    password
) {

    return {

        id: Number(id),

        number: String(number),

        type: type,

        driver: driver || "",

        password: password || "",

        status: VEHICLE_STATUS.WORKING,

        driverStatus: DRIVER_STATUS.PRESENT,

        maintenance: MAINTENANCE_STATUS.NONE,

        notes: "",

        lastUpdate: ""

    };

}


/* =========================================================
   DEFAULT PRIVATE VEHICLES
   ========================================================= */

const PRIVATE_VEHICLES = [

    createVehicle(
        1,
        "P-001",
        VEHICLE_TYPES.PRIVATE,
        "Ahmed Ali",
        "P1001"
    ),

    createVehicle(
        2,
        "P-002",
        VEHICLE_TYPES.PRIVATE,
        "Mohamed Hassan",
        "P1002"
    ),

    createVehicle(
        3,
        "P-003",
        VEHICLE_TYPES.PRIVATE,
        "Mahmoud Ibrahim",
        "P1003"
    ),

    createVehicle(
        4,
        "P-004",
        VEHICLE_TYPES.PRIVATE,
        "Khaled Ahmed",
        "P1004"
    ),

    createVehicle(
        5,
        "P-005",
        VEHICLE_TYPES.PRIVATE,
        "Omar Salem",
        "P1005"
    )

];


/* =========================================================
   DEFAULT TRUCKS
   ========================================================= */

const TRUCKS_VEHICLES = [

    createVehicle(
        101,
        "T-001",
        VEHICLE_TYPES.TRUCKS,
        "Abdullah Ali",
        "T1001"
    ),

    createVehicle(
        102,
        "T-002",
        VEHICLE_TYPES.TRUCKS,
        "Hassan Ahmed",
        "T1002"
    ),

    createVehicle(
        103,
        "T-003",
        VEHICLE_TYPES.TRUCKS,
        "Saleh Mohamed",
        "T1003"
    ),

    createVehicle(
        104,
        "T-004",
        VEHICLE_TYPES.TRUCKS,
        "Yasser Ali",
        "T1004"
    ),

    createVehicle(
        105,
        "T-005",
        VEHICLE_TYPES.TRUCKS,
        "Fahad Hassan",
        "T1005"
    )

];


/* =========================================================
   DEFAULT EQUIPMENT
   ========================================================= */

const EQUIPMENT_VEHICLES = [

    createVehicle(
        201,
        "E-001",
        VEHICLE_TYPES.EQUIPMENT,
        "Ibrahim Ahmed",
        "E1001"
    ),

    createVehicle(
        202,
        "E-002",
        VEHICLE_TYPES.EQUIPMENT,
        "Saeed Ali",
        "E1002"
    ),

    createVehicle(
        203,
        "E-003",
        VEHICLE_TYPES.EQUIPMENT,
        "Nasser Hassan",
        "E1003"
    ),

    createVehicle(
        204,
        "E-004",
        VEHICLE_TYPES.EQUIPMENT,
        "Walid Mohamed",
        "E1004"
    ),

    createVehicle(
        205,
        "E-005",
        VEHICLE_TYPES.EQUIPMENT,
        "Tariq Ahmed",
        "E1005"
    )

];


/* =========================================================
   DEFAULT SPECIAL VEHICLES
   ========================================================= */

const SPECIAL_VEHICLES = [

    createVehicle(
        301,
        "S-001",
        VEHICLE_TYPES.SPECIAL,
        "Ayman Ali",
        "S1001"
    ),

    createVehicle(
        302,
        "S-002",
        VEHICLE_TYPES.SPECIAL,
        "Khaled Ibrahim",
        "S1002"
    ),

    createVehicle(
        303,
        "S-003",
        VEHICLE_TYPES.SPECIAL,
        "Samir Ahmed",
        "S1003"
    ),

    createVehicle(
        304,
        "S-004",
        VEHICLE_TYPES.SPECIAL,
        "Nabil Hassan",
        "S1004"
    )

];


/* =========================================================
   DEFAULT GENERATORS & PUMPS
   ========================================================= */

const GENERATOR_VEHICLES = [

    createVehicle(
        401,
        "G-001",
        VEHICLE_TYPES.GENERATORS,
        "Mostafa Ali",
        "G1001"
    ),

    createVehicle(
        402,
        "G-002",
        VEHICLE_TYPES.GENERATORS,
        "Hany Ahmed",
        "G1002"
    ),

    createVehicle(
        403,
        "G-003",
        VEHICLE_TYPES.GENERATORS,
        "Adel Hassan",
        "G1003"
    ),

    createVehicle(
        404,
        "G-004",
        VEHICLE_TYPES.GENERATORS,
        "Waleed Ali",
        "G1004"
    )

];


/* =========================================================
   MAIN VEHICLE ARRAY
   ========================================================= */

const vehicles = [

    ...PRIVATE_VEHICLES,

    ...TRUCKS_VEHICLES,

    ...EQUIPMENT_VEHICLES,

    ...SPECIAL_VEHICLES,

    ...GENERATOR_VEHICLES

];


/* =========================================================
   DISPLAY NAMES
   ========================================================= */

const VEHICLE_TYPE_NAMES = {

    PRIVATE:
        "Private Vehicles",

    TRUCKS:
        "Trucks & Tractors",

    EQUIPMENT:
        "Heavy & Light Equipment",

    SPECIAL:
        "Special Vehicles",

    GENERATORS:
        "Generators & Pumps"

};


/* =========================================================
   VEHICLE STATUS DISPLAY NAMES
   ========================================================= */

const VEHICLE_STATUS_NAMES = {

    working:
        "Working",

    defective:
        "Defective",

    stopped:
        "Stopped"

};


/* =========================================================
   DRIVER STATUS DISPLAY NAMES
   ========================================================= */

const DRIVER_STATUS_NAMES = {

    present:
        "Present",

    absent:
        "Absent",

    sick:
        "Sick Leave",

    annual:
        "Annual Leave"

};


/* =========================================================
   MAINTENANCE DISPLAY NAMES
   ========================================================= */

const MAINTENANCE_STATUS_NAMES = {

    none:
        "No Maintenance",

    periodic:
        "Periodic Maintenance",

    emergency:
        "Emergency Maintenance"

};


/* =========================================================
   DEFAULT ADMIN SETTINGS
   ========================================================= */

const DEFAULT_ADMIN_PASSWORD = "1234";


/* =========================================================
   GOOGLE SHEETS API
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxcpsWtq2IB0nXePZFty9_kX53Dq8ABRYb0uQ_hmqA0Y1NKog8vU3a7wXlQcUoC_qjh/exec";


/* =========================================================
   APPLICATION CONFIGURATION
   ========================================================= */

const APP_CONFIG = {

    companyName:
        "Al-Rashed Technology & Energy Company",

    applicationName:
        "ATP FLEET MANAGEMENT",

    defaultAdminPassword:
        DEFAULT_ADMIN_PASSWORD,

    apiUrl:
        API_URL,

    noteIconEmpty:
        "✉️",

    noteIconExists:
        "📩",

    dateLocale:
        "en-SA",

    timeLocale:
        "en-SA"

};


/* =========================================================
   DEFAULT DATA INFORMATION
   ========================================================= */

console.log(
    "ATP Fleet Management database loaded:",
    vehicles.length,
    "vehicles."
);
