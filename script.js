/* =========================================================
   ATP FLEET MANAGEMENT
   SCRIPT.JS
   VERSION 6.0
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ADMIN_PASSWORD = "1234";

const API_URL =
    "https://script.google.com/macros/s/AKfycbxcpsWtq2IB0nXePZFty9_kX53Dq8ABRYb0uQ_hmqA0Y1NKog8vU3a7wXlQcUoC_qjh/exec";


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

    FAULT: "fault",

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
   DOM ELEMENTS
   ========================================================= */

const homePage =
    document.getElementById("homePage");

const registerPage =
    document.getElementById("registerPage");

const viewPage =
    document.getElementById("viewPage");


const vehicleType =
    document.getElementById("vehicleType");

const vehicleNumber =
    document.getElementById("vehicleNumber");

const driverName =
    document.getElementById("driverName");

const driverStatus =
    document.getElementById("driverStatus");

const vehicleStatus =
    document.getElementById("vehicleStatus");

const maintenanceStatus =
    document.getElementById("maintenanceStatus");

const vehicleNotes =
    document.getElementById("vehicleNotes");


const todayName =
    document.getElementById("todayName");

const todayDate =
    document.getElementById("todayDate");

const todayTime =
    document.getElementById("todayTime");


/* =========================================================
   SAFE VEHICLE ARRAY
   ========================================================= */

if (typeof vehicles === "undefined") {

    window.vehicles = [];

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function hideAllPages() {

    if (homePage) {
        homePage.style.display = "none";
    }

    if (registerPage) {
        registerPage.style.display = "none";
    }

    if (viewPage) {
        viewPage.style.display = "none";
    }

}


function showHomePage() {

    hideAllPages();

    if (homePage) {
        homePage.style.display = "block";
    }

}


function showRegisterPage() {

    hideAllPages();

    if (registerPage) {
        registerPage.style.display = "block";
    }

    resetForm();

}


function showViewPage() {

    hideAllPages();

    if (viewPage) {
        viewPage.style.display = "block";
    }

    renderVehicles();

}


function goHome() {

    showHomePage();

    resetForm();

}


/* =========================================================
   SECTION TOGGLE
   ========================================================= */

function toggleSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (!section) {
        return;
    }

    if (
        section.style.display === "none" ||
        section.style.display === ""
    ) {

        section.style.display = "block";

    } else {

        section.style.display = "none";

    }

}


/* =========================================================
   DATE & TIME
   ========================================================= */

const arabicDays = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];


function updateDateTime() {

    const now = new Date();

    if (todayName) {

        todayName.textContent =
            arabicDays[now.getDay()];

    }

    if (todayDate) {

        todayDate.textContent =
            now.toLocaleDateString(
                "en-SA",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }

    if (todayTime) {

        todayTime.textContent =
            now.toLocaleTimeString(
                "en-SA",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

    }

}


function startClock() {

    updateDateTime();

    setInterval(
        updateDateTime,
        1000
    );

}


/* =========================================================
   VEHICLE DATA FUNCTIONS
   ========================================================= */

function getVehicleById(id) {

    return vehicles.find(
        vehicle =>
            String(vehicle.id) === String(id)
    );

}


function getVehiclesByType(type) {

    return vehicles.filter(
        vehicle =>
            vehicle.type === type
    );

}


/* =========================================================
   UPDATE LOCAL VEHICLE
   ========================================================= */

function updateVehicle(id, data) {

    const vehicle =
        getVehicleById(id);

    if (!vehicle) {
        return false;
    }

    Object.assign(
        vehicle,
        data
    );

    vehicle.lastUpdate =
        new Date().toISOString();

    return true;

}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetForm() {

    if (vehicleType) {
        vehicleType.value = "";
    }

    if (vehicleNumber) {

        vehicleNumber.innerHTML = `
            <option value="">
                Select Vehicle
            </option>
        `;

    }

    if (driverName) {

        driverName.textContent =
            "---";

    }

    if (vehicleStatus) {

        vehicleStatus.value =
            VEHICLE_STATUS.WORKING;

    }

    if (driverStatus) {

        driverStatus.value =
            DRIVER_STATUS.PRESENT;

    }

    if (maintenanceStatus) {

        maintenanceStatus.value =
            MAINTENANCE_STATUS.NONE;

    }

    if (vehicleNotes) {

        vehicleNotes.value = "";

    }

}


/* =========================================================
   VEHICLE TYPE NAME
   ========================================================= */

function getTypeName(type) {

    switch (type) {

        case VEHICLE_TYPES.PRIVATE:
            return "Small Vehicles";

        case VEHICLE_TYPES.TRUCKS:
            return "Trucks & Tractors";

        case VEHICLE_TYPES.EQUIPMENT:
            return "Heavy & Small Equipment";

        case VEHICLE_TYPES.SPECIAL:
            return "Special Vehicles";

        case VEHICLE_TYPES.GENERATORS:
            return "Generators & Pumps";

        default:
            return "";

    }

}


/* =========================================================
   LOAD VEHICLE NUMBERS
   ========================================================= */

function loadVehicleNumbers() {

    if (!vehicleNumber) {
        return;
    }

    vehicleNumber.innerHTML = `
        <option value="">
            Select Vehicle
        </option>
    `;

    if (driverName) {

        driverName.textContent =
            "---";

    }

    if (!vehicleType ||
        !vehicleType.value) {

        return;

    }

    const list =
        getVehiclesByType(
            vehicleType.value
        );

    list.forEach(vehicle => {

        const option =
            document.createElement("option");

        option.value =
            vehicle.id;

        option.textContent =
            vehicle.number;

        vehicleNumber.appendChild(
            option
        );

    });

}


/* =========================================================
   LOAD VEHICLE INFORMATION
   ========================================================= */

function loadVehicleInformation() {

    const vehicle =
        getVehicleById(
            vehicleNumber.value
        );

    if (!vehicle) {

        if (driverName) {
            driverName.textContent = "---";
        }

        return;

    }

    if (driverName) {

        driverName.textContent =
            vehicle.driver || "---";

    }

    if (vehicleStatus) {

        vehicleStatus.value =
            vehicle.status ||
            VEHICLE_STATUS.WORKING;

    }

    if (driverStatus) {

        driverStatus.value =
            vehicle.driverStatus ||
            DRIVER_STATUS.PRESENT;

    }

    if (maintenanceStatus) {

        maintenanceStatus.value =
            vehicle.maintenance ||
            MAINTENANCE_STATUS.NONE;

    }

    if (vehicleNotes) {

        vehicleNotes.value =
            vehicle.notes || "";

    }

}


/* =========================================================
   SAVE VEHICLE REPORT
   ========================================================= */

async function saveVehicleReport() {

    const vehicle =
        getVehicleById(
            vehicleNumber.value
        );

    if (!vehicle) {

        alert(
            "Please select a vehicle."
        );

        return;

    }

    const reportData = {

        id: vehicle.id,

        number: vehicle.number,

        type: vehicle.type,

        driver: vehicle.driver,

        status: vehicleStatus.value,

        driverStatus: driverStatus.value,

        maintenance: maintenanceStatus.value,

        notes: vehicleNotes.value.trim(),

        lastUpdate:
            new Date().toISOString()

    };

    Object.assign(
        vehicle,
        reportData
    );

    renderVehicles();

    alert(
        "Vehicle status has been saved successfully."
    );

    resetForm();

}


/* =========================================================
   STATISTICS
   ========================================================= */

function getSectionStatistics(type) {

    const list =
        getVehiclesByType(type);

    return {

        total:
            list.length,

        working:
            list.filter(
                vehicle =>
                    vehicle.status ===
                    VEHICLE_STATUS.WORKING
            ).length,

        fault:
            list.filter(
                vehicle =>
                    vehicle.status ===
                    VEHICLE_STATUS.FAULT
            ).length,

        stopped:
            list.filter(
                vehicle =>
                    vehicle.status ===
                    VEHICLE_STATUS.STOPPED
            ).length

    };

}


/* =========================================================
   UPDATE SECTION STATISTICS
   ========================================================= */

function updateSectionCard(
    type,
    prefix
) {

    const statistics =
        getSectionStatistics(type);


    const total =
        document.getElementById(
            prefix + "Total"
        );

    const working =
        document.getElementById(
            prefix + "Working"
        );

    const fault =
        document.getElementById(
            prefix + "Fault"
        );

    const stopped =
        document.getElementById(
            prefix + "Stopped"
        );


    if (total) {

        total.textContent =
            statistics.total;

    }

    if (working) {

        working.textContent =
            statistics.working;

    }

    if (fault) {

        fault.textContent =
            statistics.fault;

    }

    if (stopped) {

        stopped.textContent =
            statistics.stopped;

    }

}


/* =========================================================
   UPDATE ALL STATISTICS
   ========================================================= */

function updateStatistics() {

    const sections = [

        {
            type: VEHICLE_TYPES.PRIVATE,
            prefix: "private"
        },

        {
            type: VEHICLE_TYPES.TRUCKS,
            prefix: "trucks"
        },

        {
            type: VEHICLE_TYPES.EQUIPMENT,
            prefix: "equipment"
        },

        {
            type: VEHICLE_TYPES.SPECIAL,
            prefix: "special"
        },

        {
            type: VEHICLE_TYPES.GENERATORS,
            prefix: "generator"
        }

    ];

    sections.forEach(section => {

        updateSectionCard(
            section.type,
            section.prefix
        );

    });

}


/* =========================================================
   RENDER VEHICLES
   ========================================================= */

function renderVehicles() {

    const sections = [

        {
            type: VEHICLE_TYPES.PRIVATE,
            container: "privateSection"
        },

        {
            type: VEHICLE_TYPES.TRUCKS,
            container: "trucksSection"
        },

        {
            type: VEHICLE_TYPES.EQUIPMENT,
            container: "equipmentSection"
        },

        {
            type: VEHICLE_TYPES.SPECIAL,
            container: "specialSection"
        },

        {
            type: VEHICLE_TYPES.GENERATORS,
            container: "generatorSection"
        }

    ];


    sections.forEach(section => {

        renderSection(
            section.type,
            section.container
        );

    });


    updateStatistics();

}


/* =========================================================
   RENDER SECTION
   ========================================================= */

function renderSection(
    type,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const list =
        getVehiclesByType(type);


    list.forEach(vehicle => {

        container.appendChild(
            createVehicleRow(vehicle)
        );

    });

}


/* =========================================================
   CREATE VEHICLE CARD
   ========================================================= */

function createVehicleRow(vehicle) {

    const row =
        document.createElement("div");

    row.className =
        "vehicle-card";


    const noteIcon =
        vehicle.notes &&
        vehicle.notes.trim() !== ""
            ? "📩"
            : "✉️";


    row.innerHTML = `

        <div class="vehicle-status
            ${getVehicleStatusClass(vehicle.status)}">

            ${getVehicleStatusText(vehicle.status)}

        </div>


        <div class="vehicle-number">

            ${escapeHtml(
                vehicle.number || "-"
            )}

        </div>


        <div class="vehicle-driver">

            ${escapeHtml(
                vehicle.driver || "-"
            )}

        </div>


        <div class="vehicle-driver-status
            ${getDriverStatusClass(vehicle.driverStatus)}">

            ${getDriverStatusText(
                vehicle.driverStatus
            )}

        </div>


        <div class="vehicle-maintenance
            ${getMaintenanceClass(vehicle.maintenance)}">

            ${getMaintenanceText(
                vehicle.maintenance
            )}

        </div>


        <div class="vehicle-note">

            <button
                type="button"
                class="note-button"
                onclick="showVehicleNotes('${vehicle.id}')">

                ${noteIcon}

            </button>

        </div>


        <div class="vehicle-update">

            ${formatLastUpdate(
                vehicle.lastUpdate
            )}

        </div>

    `;


    return row;

}


/* =========================================================
   SHOW VEHICLE NOTES
   ========================================================= */

function showVehicleNotes(vehicleId) {

    const vehicle =
        getVehicleById(vehicleId);

    if (!vehicle) {
        return;
    }

    const notes =
        vehicle.notes &&
        vehicle.notes.trim() !== ""
            ? vehicle.notes
            : "No notes available.";

    alert(
        "Vehicle: " +
        vehicle.number +
        "\n\n" +
        notes
    );

}


/* =========================================================
   VEHICLE STATUS TEXT
   ========================================================= */

function getVehicleStatusText(status) {

    switch (status) {

        case VEHICLE_STATUS.WORKING:
            return "Working";

        case VEHICLE_STATUS.FAULT:
            return "Fault";

        case VEHICLE_STATUS.STOPPED:
            return "Stopped";

        default:
            return "-";

    }

}


/* =========================================================
   DRIVER STATUS TEXT
   ========================================================= */

function getDriverStatusText(status) {

    switch (status) {

        case DRIVER_STATUS.PRESENT:
            return "Present";

        case DRIVER_STATUS.ABSENT:
            return "Absent";

        case DRIVER_STATUS.SICK:
            return "Sick Leave";

        case DRIVER_STATUS.ANNUAL:
            return "Annual Leave";

        default:
            return "-";

    }

}


/* =========================================================
   MAINTENANCE TEXT
   ========================================================= */

function getMaintenanceText(status) {

    switch (status) {

        case MAINTENANCE_STATUS.NONE:
            return "None";

        case MAINTENANCE_STATUS.PERIODIC:
            return "Periodic";

        case MAINTENANCE_STATUS.EMERGENCY:
            return "Emergency";

        default:
            return "-";

    }

}


/* =========================================================
   VEHICLE STATUS CSS
   ========================================================= */

function getVehicleStatusClass(status) {

    switch (status) {

        case VEHICLE_STATUS.WORKING:
            return "status-working";

        case VEHICLE_STATUS.FAULT:
            return "status-fault";

        case VEHICLE_STATUS.STOPPED:
            return "status-stopped";

        default:
            return "";

    }

}


/* =========================================================
   DRIVER STATUS CSS
   ========================================================= */

function getDriverStatusClass(status) {

    switch (status) {

        case DRIVER_STATUS.PRESENT:
            return "driver-present";

        case DRIVER_STATUS.ABSENT:
            return "driver-absent";

        case DRIVER_STATUS.SICK:
            return "driver-sick";

        case DRIVER_STATUS.ANNUAL:
            return "driver-annual";

        default:
            return "";

    }

}


/* =========================================================
   MAINTENANCE CSS
   ========================================================= */

function getMaintenanceClass(status) {

    switch (status) {

        case MAINTENANCE_STATUS.NONE:
            return "maintenance-none";

        case MAINTENANCE_STATUS.PERIODIC:
            return "maintenance-periodic";

        case MAINTENANCE_STATUS.EMERGENCY:
            return "maintenance-emergency";

        default:
            return "";

    }

}


/* =========================================================
   LAST UPDATE FORMAT
   ========================================================= */

function formatLastUpdate(value) {

    if (!value) {
        return "-";
    }

    const updateDate =
        new Date(value);

    if (isNaN(updateDate.getTime())) {
        return "-";
    }

    const now =
        new Date();

    const difference =
        Math.max(
            0,
            now - updateDate
        );


    const seconds =
        Math.floor(
            difference / 1000
        );

    const minutes =
        Math.floor(
            seconds / 60
        );

    const hours =
        Math.floor(
            minutes / 60
        );

    const days =
        Math.floor(
            hours / 24
        );


    if (days > 0) {

        return days + " D";

    }

    if (hours > 0) {

        return hours + " H";

    }

    if (minutes > 0) {

        return minutes + " M";

    }

    return seconds + " S";

}


/* =========================================================
   PASSWORD
   ========================================================= */

function checkPassword() {

    const password =
        prompt(
            "Enter the password to view vehicle status:"
        );


    if (password === ADMIN_PASSWORD) {

        showViewPage();

    }

    else if (password !== null) {

        alert(
            "Incorrect password."
        );

    }

}


/* =========================================================
   VEHICLE PASSWORD
   ========================================================= */

function checkVehiclePassword(vehicle) {

    if (!vehicle) {
        return false;
    }

    const password =
        prompt(
            "Enter the vehicle password:"
        );

    if (
        password === null ||
        password === ""
    ) {

        return false;

    }

    return String(password) ===
        String(vehicle.password);

}


/* =========================================================
   WHATSAPP REPORT
   ========================================================= */

function saveAndSendReport() {

    const vehicle =
        getVehicleById(
            vehicleNumber.value
        );


    if (!vehicle) {

        alert(
            "Please select a vehicle."
        );

        return;

    }


    const reportTime =
        new Date();


    updateVehicle(

        vehicle.id,

        {

            status:
                vehicleStatus.value,

            driverStatus:
                driverStatus.value,

            maintenance:
                maintenanceStatus.value,

            notes:
                vehicleNotes.value.trim(),

            lastUpdate:
                reportTime.toISOString()

        }

    );


    const message =

`ATP Fleet Management
Vehicle: ${vehicle.number}
Driver: ${vehicle.driver || "-"}
Vehicle Status: ${getVehicleStatusText(vehicleStatus.value)}
Driver Status: ${getDriverStatusText(driverStatus.value)}
Maintenance: ${getMaintenanceText(maintenanceStatus.value)}
Notes: ${vehicleNotes.value.trim() || "None"}
Update Time: ${reportTime.toLocaleString("en-SA")}`;


    const whatsappURL =
        "https://wa.me/?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );


    renderVehicles();

}


/* =========================================================
   OPEN WHATSAPP
   ========================================================= */

function openWhatsApp(message) {

    const url =
        "https://wa.me/?text=" +
        encodeURIComponent(message);

    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   LOAD VEHICLES FROM GOOGLE SHEETS
   ========================================================= */

async function loadVehiclesFromServer() {

    try {

        const response =
            await fetch(
                API_URL +
                "?action=getVehicles"
            );


        if (!response.ok) {

            throw new Error(
                "Server response error"
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid vehicle data"
            );

        }


        vehicles.length = 0;


        data.forEach(vehicle => {

            vehicles.push(vehicle);

        });


        renderVehicles();

    }

    catch (error) {

        console.error(
            "Vehicle loading error:",
            error
        );

        /*
           Keep default data from data.js
           if Google Sheets is unavailable.
        */

        renderVehicles();

    }

}


/* =========================================================
   AUTO REFRESH
   ========================================================= */

function startAutoRefresh() {

    setInterval(

        async function() {

            await loadVehiclesFromServer();

        },

        30000

    );

}


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

async function initializeApp() {

    hideAllPages();

    showHomePage();

    startClock();

    renderVehicles();

    await loadVehiclesFromServer();

    startAutoRefresh();

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

if (vehicleType) {

    vehicleType.addEventListener(
        "change",
        loadVehicleNumbers
    );

}


if (vehicleNumber) {

    vehicleNumber.addEventListener(
        "change",
        loadVehicleInformation
    );

}


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


/* =========================================================
   END OF SCRIPT.JS
   ========================================================= */
