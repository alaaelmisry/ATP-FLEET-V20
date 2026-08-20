/*******************************************************
 * ATP FLEET MANAGEMENT
 * GOOGLE APPS SCRIPT BACKEND
 *
 * File: Code.gs
 *******************************************************/


/* =====================================================
   CONFIGURATION
===================================================== */

const SPREADSHEET_ID = "";

const VEHICLES_SHEET = "Vehicles";
const REPORTS_SHEET = "Reports";


/* =====================================================
   SHEET HEADERS
===================================================== */

const VEHICLE_HEADERS = [
  "ID",
  "Type",
  "Number",
  "Driver",
  "Password",
  "Status",
  "DriverStatus",
  "Maintenance",
  "Notes",
  "LastUpdate"
];


const REPORT_HEADERS = [
  "ID",
  "VehicleID",
  "VehicleType",
  "VehicleNumber",
  "Driver",
  "VehicleStatus",
  "DriverStatus",
  "Maintenance",
  "Notes",
  "UpdateTime"
];


/* =====================================================
   SPREADSHEET
===================================================== */

function getSpreadsheet() {

  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {

    return SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  }

  return SpreadsheetApp.getActiveSpreadsheet();

}


/* =====================================================
   SHEET CREATION
===================================================== */

function getOrCreateSheet(name, headers) {

  const ss = getSpreadsheet();

  let sheet = ss.getSheetByName(name);

  if (!sheet) {

    sheet = ss.insertSheet(name);

  }


  if (sheet.getLastRow() === 0) {

    sheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers]);

  }

  return sheet;

}


/* =====================================================
   INITIALIZE DATABASE
===================================================== */

function initializeDatabase() {

  const vehiclesSheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const reportsSheet =
    getOrCreateSheet(
      REPORTS_SHEET,
      REPORT_HEADERS
    );


  vehiclesSheet
    .getRange(1, 1, 1, VEHICLE_HEADERS.length)
    .setValues([VEHICLE_HEADERS]);


  reportsSheet
    .getRange(1, 1, 1, REPORT_HEADERS.length)
    .setValues([REPORT_HEADERS]);


  return {
    success: true,
    message: "Database initialized successfully"
  };

}


/* =====================================================
   WEB APP
===================================================== */

function doGet(e) {

  try {

    const action =
      e &&
      e.parameter &&
      e.parameter.action
        ? e.parameter.action
        : "";


    switch (action) {

      case "getVehicles":

        return jsonResponse(
          getVehicles()
        );


      case "getVehicle":

        return jsonResponse(
          getVehicle(
            e.parameter.id
          )
        );


      case "verifyVehiclePassword":

        return jsonResponse(
          verifyVehiclePassword(
            e.parameter.id,
            e.parameter.password
          )
        );


      default:

        return jsonResponse({
          success: true,
          message:
            "ATP Fleet Management API is running"
        });

    }

  }

  catch (error) {

    return jsonResponse({

      success: false,

      error:
        error.message

    });

  }

}


/* =====================================================
   POST API
===================================================== */

function doPost(e) {

  try {

    const data =
      parseRequest(e);


    const action =
      data.action || "";


    switch (action) {

      case "saveReport":

        return jsonResponse(
          saveReport(data)
        );


      case "addVehicle":

        return jsonResponse(
          addVehicle(data)
        );


      case "updateVehicle":

        return jsonResponse(
          updateVehicle(data)
        );


      case "deleteVehicle":

        return jsonResponse(
          deleteVehicle(data)
        );


      case "initializeDatabase":

        return jsonResponse(
          initializeDatabase()
        );


      default:

        return jsonResponse({

          success: false,

          error:
            "Unknown action"

        });

    }

  }

  catch (error) {

    return jsonResponse({

      success: false,

      error:
        error.message

    });

  }

}


/* =====================================================
   GET VEHICLES
===================================================== */

function getVehicles() {

  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const values =
    sheet.getDataRange().getValues();


  if (values.length <= 1) {

    return [];

  }


  const vehicles = [];


  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    const row =
      values[i];


    if (
      row[0] === "" ||
      row[0] === null
    ) {

      continue;

    }


    vehicles.push({

      id:
        Number(row[0]),

      type:
        String(row[1] || ""),

      number:
        String(row[2] || ""),

      driver:
        String(row[3] || ""),

      /*
       * Password is intentionally
       * not returned to the public page.
       */

      status:
        String(row[5] || "working"),

      driverStatus:
        String(row[6] || "present"),

      maintenance:
        String(row[7] || "none"),

      notes:
        String(row[8] || ""),

      lastUpdate:
        formatDateForClient(
          row[9]
        )

    });

  }


  return vehicles;

}


/* =====================================================
   GET SINGLE VEHICLE
===================================================== */

function getVehicle(id) {

  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const rowNumber =
    findVehicleRow(
      sheet,
      id
    );


  if (!rowNumber) {

    return {

      success: false,

      error:
        "Vehicle not found"

    };

  }


  const row =
    sheet
      .getRange(
        rowNumber,
        1,
        1,
        VEHICLE_HEADERS.length
      )
      .getValues()[0];


  return {

    success: true,

    vehicle: {

      id:
        Number(row[0]),

      type:
        String(row[1] || ""),

      number:
        String(row[2] || ""),

      driver:
        String(row[3] || ""),

      status:
        String(row[5] || "working"),

      driverStatus:
        String(row[6] || "present"),

      maintenance:
        String(row[7] || "none"),

      notes:
        String(row[8] || ""),

      lastUpdate:
        formatDateForClient(row[9])

    }

  };

}


/* =====================================================
   SAVE VEHICLE STATUS REPORT
===================================================== */

function saveReport(data) {

  if (!data.vehicleId) {

    throw new Error(
      "Vehicle ID is required"
    );

  }


  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const rowNumber =
    findVehicleRow(
      sheet,
      data.vehicleId
    );


  if (!rowNumber) {

    throw new Error(
      "Vehicle not found"
    );

  }


  const row =
    sheet
      .getRange(
        rowNumber,
        1,
        1,
        VEHICLE_HEADERS.length
      )
      .getValues()[0];


  const vehiclePassword =
    String(row[4] || "");


  /*
   * Vehicle-specific password verification.
   */

  if (
    data.password &&
    String(data.password) !== vehiclePassword
  ) {

    throw new Error(
      "Invalid vehicle password"
    );

  }


  const updateTime =
    new Date();


  const newStatus =
    normalizeVehicleStatus(
      data.vehicleStatus
    );


  const newDriverStatus =
    normalizeDriverStatus(
      data.driverStatus
    );


  const newMaintenance =
    normalizeMaintenance(
      data.maintenance
    );


  const notes =
    String(
      data.notes || ""
    ).trim();


  /*
   * Update vehicle master record.
   */

  sheet
    .getRange(
      rowNumber,
      6,
      1,
      5
    )
    .setValues([[
      newStatus,
      newDriverStatus,
      newMaintenance,
      notes,
      updateTime
    ]]);


  /*
   * Save complete report
   * into Reports sheet.
   */

  const reportsSheet =
    getOrCreateSheet(
      REPORTS_SHEET,
      REPORT_HEADERS
    );


  const reportId =
    generateId();


  reportsSheet.appendRow([

    reportId,

    Number(data.vehicleId),

    String(row[1] || ""),

    String(row[2] || ""),

    String(row[3] || ""),

    newStatus,

    newDriverStatus,

    newMaintenance,

    notes,

    updateTime

  ]);


  return {

    success: true,

    message:
      "Vehicle status saved successfully",

    vehicle: {

      id:
        Number(row[0]),

      type:
        String(row[1] || ""),

      number:
        String(row[2] || ""),

      driver:
        String(row[3] || ""),

      status:
        newStatus,

      driverStatus:
        newDriverStatus,

      maintenance:
        newMaintenance,

      notes:
        notes,

      lastUpdate:
        formatDateForClient(
          updateTime
        )

    }

  };

}


/* =====================================================
   ADD VEHICLE
===================================================== */

function addVehicle(data) {

  validateVehicleData(
    data
  );


  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const id =
    getNextVehicleId(
      sheet
    );


  /*
   * Every vehicle receives
   * its own unique password.
   */

  const password =
    data.password &&
    String(data.password).trim() !== ""

      ? String(data.password).trim()

      : generateVehiclePassword();


  const now =
    new Date();


  sheet.appendRow([

    id,

    String(data.type || ""),

    String(data.number || ""),

    String(data.driver || ""),

    password,

    normalizeVehicleStatus(
      data.status
    ),

    normalizeDriverStatus(
      data.driverStatus
    ),

    normalizeMaintenance(
      data.maintenance
    ),

    String(data.notes || ""),

    now

  ]);


  return {

    success: true,

    message:
      "Vehicle added successfully",

    vehicle: {

      id: id,

      type:
        String(data.type || ""),

      number:
        String(data.number || ""),

      driver:
        String(data.driver || ""),

      status:
        normalizeVehicleStatus(
          data.status
        ),

      driverStatus:
        normalizeDriverStatus(
          data.driverStatus
        ),

      maintenance:
        normalizeMaintenance(
          data.maintenance
        ),

      notes:
        String(data.notes || ""),

      lastUpdate:
        formatDateForClient(
          now
        )

    },

    /*
     * Show this once to the supervisor
     * so it can be assigned to the vehicle.
     */

    vehiclePassword:
      password

  };

}


/* =====================================================
   UPDATE VEHICLE MASTER DATA
===================================================== */

function updateVehicle(data) {

  if (!data.vehicleId) {

    throw new Error(
      "Vehicle ID is required"
    );

  }


  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const rowNumber =
    findVehicleRow(
      sheet,
      data.vehicleId
    );


  if (!rowNumber) {

    throw new Error(
      "Vehicle not found"
    );

  }


  const row =
    sheet
      .getRange(
        rowNumber,
        1,
        1,
        VEHICLE_HEADERS.length
      )
      .getValues()[0];


  /*
   * Supervisor authorization.
   */

  if (
    String(data.adminPassword || "") !==
    getAdminPassword()
  ) {

    throw new Error(
      "Invalid administrator password"
    );

  }


  const currentPassword =
    String(row[4] || "");


  const newPassword =
    data.vehiclePassword &&
    String(data.vehiclePassword).trim() !== ""

      ? String(data.vehiclePassword).trim()

      : currentPassword;


  const newType =
    data.type !== undefined
      ? String(data.type)
      : String(row[1] || "");


  const newNumber =
    data.number !== undefined
      ? String(data.number)
      : String(row[2] || "");


  const newDriver =
    data.driver !== undefined
      ? String(data.driver)
      : String(row[3] || "");


  const newStatus =
    data.status !== undefined

      ? normalizeVehicleStatus(
          data.status
        )

      : String(
          row[5] || "working"
        );


  const newDriverStatus =
    data.driverStatus !== undefined

      ? normalizeDriverStatus(
          data.driverStatus
        )

      : String(
          row[6] || "present"
        );


  const newMaintenance =
    data.maintenance !== undefined

      ? normalizeMaintenance(
          data.maintenance
        )

      : String(
          row[7] || "none"
        );


  const newNotes =
    data.notes !== undefined

      ? String(data.notes)

      : String(row[8] || "");


  sheet
    .getRange(
      rowNumber,
      1,
      1,
      VEHICLE_HEADERS.length
    )
    .setValues([[
      Number(row[0]),
      newType,
      newNumber,
      newDriver,
      newPassword,
      newStatus,
      newDriverStatus,
      newMaintenance,
      newNotes,
      row[9] || new Date()
    ]]);


  return {

    success: true,

    message:
      "Vehicle updated successfully"

  };

}


/* =====================================================
   DELETE VEHICLE
===================================================== */

function deleteVehicle(data) {

  if (
    String(data.adminPassword || "") !==
    getAdminPassword()
  ) {

    throw new Error(
      "Invalid administrator password"
    );

  }


  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const rowNumber =
    findVehicleRow(
      sheet,
      data.vehicleId
    );


  if (!rowNumber) {

    throw new Error(
      "Vehicle not found"
    );

  }


  sheet.deleteRow(
    rowNumber
  );


  return {

    success: true,

    message:
      "Vehicle deleted successfully"

  };

}


/* =====================================================
   VERIFY VEHICLE PASSWORD
===================================================== */

function verifyVehiclePassword(
  vehicleId,
  password
) {

  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  const rowNumber =
    findVehicleRow(
      sheet,
      vehicleId
    );


  if (!rowNumber) {

    return {

      success: false,

      valid: false,

      error:
        "Vehicle not found"

    };

  }


  const storedPassword =
    String(
      sheet
        .getRange(
          rowNumber,
          5
        )
        .getValue()
    );


  return {

    success: true,

    valid:
      storedPassword ===
      String(password || "")

  };

}


/* =====================================================
   FIND VEHICLE ROW
===================================================== */

function findVehicleRow(
  sheet,
  id
) {

  const values =
    sheet
      .getRange(
        2,
        1,
        Math.max(
          sheet.getLastRow() - 1,
          0
        ),
        1
      )
      .getValues();


  const target =
    Number(id);


  for (
    let i = 0;
    i < values.length;
    i++
  ) {

    if (
      Number(values[i][0]) ===
      target
    ) {

      return i + 2;

    }

  }


  return null;

}


/* =====================================================
   NEXT VEHICLE ID
===================================================== */

function getNextVehicleId(
  sheet
) {

  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {

    return 1;

  }


  const ids =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        1
      )
      .getValues()
      .flat()
      .map(
        value =>
          Number(value)
      )
      .filter(
        value =>
          !isNaN(value)
      );


  if (!ids.length) {

    return 1;

  }


  return Math.max(...ids) + 1;

}


/* =====================================================
   VEHICLE PASSWORD GENERATOR
===================================================== */

function generateVehiclePassword() {

  /*
   * Six-digit unique password.
   */

  const random =
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  return String(random);

}


/* =====================================================
   ADMIN PASSWORD
===================================================== */

function getAdminPassword() {

  /*
   * Default administrator password.
   *
   * Change this value before production.
   */

  return "1234";

}


/* =====================================================
   GENERATE ID
===================================================== */

function generateId() {

  return (
    new Date().getTime()
    +
    Math.floor(
      Math.random() * 1000
    )
  ).toString();

}


/* =====================================================
   NORMALIZE VEHICLE STATUS
===================================================== */

function normalizeVehicleStatus(
  status
) {

  const value =
    String(
      status || ""
    ).toLowerCase();


  if (
    value === "disabled" ||
    value === "fault" ||
    value === "faulty"
  ) {

    return "disabled";

  }


  if (
    value === "stopped" ||
    value === "stop"
  ) {

    return "stopped";

  }


  return "working";

}


/* =====================================================
   NORMALIZE DRIVER STATUS
===================================================== */

function normalizeDriverStatus(
  status
) {

  const value =
    String(
      status || ""
    ).toLowerCase();


  const allowed = [

    "present",
    "absent",
    "sick",
    "annual"

  ];


  if (
    allowed.indexOf(value) !== -1
  ) {

    return value;

  }


  return "present";

}


/* =====================================================
   NORMALIZE MAINTENANCE
===================================================== */

function normalizeMaintenance(
  status
) {

  const value =
    String(
      status || ""
    ).toLowerCase();


  const allowed = [

    "none",
    "periodic",
    "emergency"

  ];


  if (
    allowed.indexOf(value) !== -1
  ) {

    return value;

  }


  return "none";

}


/* =====================================================
   VALIDATE VEHICLE
===================================================== */

function validateVehicleData(
  data
) {

  if (
    !data.type
  ) {

    throw new Error(
      "Vehicle type is required"
    );

  }


  if (
    !data.number
  ) {

    throw new Error(
      "Vehicle number is required"
    );

  }


  if (
    !data.driver
  ) {

    throw new Error(
      "Driver name is required"
    );

  }

}


/* =====================================================
   PARSE REQUEST
===================================================== */

function parseRequest(e) {

  if (
    !e ||
    !e.postData
  ) {

    return {};

  }


  const contentType =
    String(
      e.postData.type || ""
    ).toLowerCase();


  if (
    contentType.indexOf(
      "application/json"
    ) !== -1
  ) {

    return JSON.parse(
      e.postData.contents
    );

  }


  return e.parameter || {};

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDateForClient(
  value
) {

  if (
    !value
  ) {

    return "";

  }


  let date;


  if (
    Object.prototype.toString
      .call(value) ===
    "[object Date]"
  ) {

    date = value;

  }

  else {

    date =
      new Date(value);

  }


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return Utilities.formatDate(

    date,

    Session.getScriptTimeZone(),

    "yyyy-MM-dd'T'HH:mm:ss"

  );

}


/* =====================================================
   JSON RESPONSE
===================================================== */

function jsonResponse(
  data
) {

  return ContentService

    .createTextOutput(
      JSON.stringify(data)
    )

    .setMimeType(
      ContentService.MimeType.JSON
    );

}


/* =====================================================
   CREATE DEFAULT DATA
===================================================== */

function createDefaultVehicles() {

  const sheet =
    getOrCreateSheet(
      VEHICLES_SHEET,
      VEHICLE_HEADERS
    );


  /*
   * Do not overwrite existing data.
   */

  if (
    sheet.getLastRow() > 1
  ) {

    return {

      success: false,

      message:
        "Default vehicles already exist"

    };

  }


  const defaultVehicles = [

    [
      1,
      "PRIVATE",
      "P-001",
      "Driver 01",
      "410001",
      "working",
      "present",
      "none",
      "",
      new Date()
    ],

    [
      2,
      "PRIVATE",
      "P-002",
      "Driver 02",
      "410002",
      "working",
      "present",
      "none",
      "",
      new Date()
    ],

    [
      3,
      "TRUCKS",
      "T-001",
      "Driver 03",
      "520001",
      "working",
      "present",
      "none",
      "",
      new Date()
    ],

    [
      4,
      "TRUCKS",
      "T-002",
      "Driver 04",
      "520002",
      "disabled",
      "present",
      "emergency",
      "Example fault",
      new Date()
    ],

    [
      5,
      "EQUIPMENT",
      "E-001",
      "Operator 01",
      "630001",
      "working",
      "present",
      "none",
      "",
      new Date()
    ],

    [
      6,
      "EQUIPMENT",
      "E-002",
      "Operator 02",
      "630002",
      "stopped",
      "absent",
      "periodic",
      "",
      new Date()
    ],

    [
      7,
      "SPECIAL",
      "S-001",
      "Driver 05",
      "740001",
      "working",
      "present",
      "none",
      "",
      new Date()
    ],

    [
      8,
      "SPECIAL",
      "S-002",
      "Driver 06",
      "740002",
      "disabled",
      "present",
      "emergency",
      "Example note",
      new Date()
    ],

    [
      9,
      "GENERATORS",
      "G-001",
      "Operator 03",
      "850001",
      "working",
      "present",
      "none",
      "",
      new Date()
    ],

    [
      10,
      "GENERATORS",
      "G-002",
      "Operator 04",
      "850002",
      "stopped",
      "absent",
      "periodic",
      "",
      new Date()
    ]

  ];


  sheet
    .getRange(
      2,
      1,
      defaultVehicles.length,
      VEHICLE_HEADERS.length
    )
    .setValues(
      defaultVehicles
    );


  return {

    success: true,

    message:
      "Default vehicles created successfully"

  };

}


/* =====================================================
   INSTALLATION FUNCTION
===================================================== */

function setupATP() {

  initializeDatabase();

  createDefaultVehicles();

  return {

    success: true,

    message:
      "ATP Fleet Management setup completed"

  };

}
