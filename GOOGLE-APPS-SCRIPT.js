/**
 * LIGHTSOFTER + MONSALONVIP — CRM Google Apps Script
 * ─────────────────────────────────────────────────────────────────────────────
 * SETUP:
 * 1. Go to script.google.com → New project → paste this code
 * 2. Create a Google Sheet with two tabs: "Leads" and "Projects"
 * 3. Copy the Spreadsheet ID from the URL and paste below
 * 4. Deploy: Extensions → Apps Script → Deploy → New deployment
 *    → Type: Web App → Execute as: Me → Access: Anyone → Deploy
 * 5. Copy the Web App URL → paste as GOOGLE_SCRIPT_URL in both Vercel projects
 *
 * SHEETS STRUCTURE:
 * Leads:    ID | Date | Source | Name | Phone | Business | City | Sector | Status | Notes | WhatsApp
 * Projects: ID | Date | Client | Business | Type | Status | Price | StartDate | DueDate | URL | Notes
 */

var SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE'

var LEAD_HEADERS    = ['ID','Date','Source','Nom','Téléphone','Business','Ville','Secteur','Statut','Notes','WhatsApp']
var PROJECT_HEADERS = ['ID','Date','Client','Business','Type','Statut','Prix (€)','Début','Livraison','URL','Notes']
var INTAKE_HEADERS  = ['ID','Date','Salon','Propriétaire','Ville','Téléphone','WhatsApp','Email','Secteur','Palette','Style','Booking','LienBooking','Photos','Logo','Services','Horaires','Présentation','Note','Instagram','GoogleMaps']
var CLIENT_INTAKE_HEADERS = ['ID','Date','Source','Prénom','Entreprise','Secteur','Ville','Téléphone','Email','SiteActuel','TypeProjet','Description','Budget','Délai','Palette','Style','Logo','Photos','Services','Présentation','Domaine','Instagram','Facebook','LinkedIn','GoogleMaps','Note']

var LEAD_STATUSES    = ['Nouveau','Contacté','Devis envoyé','Client','Perdu']
var PROJECT_STATUSES = ['Brief','En cours','Révision','Livré','Maintenance','Archivé']

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSheet(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  var sh = ss.getSheetByName(name)
  if (!sh) {
    sh = ss.insertSheet(name)
    if (name === 'Leads')    sh.appendRow(LEAD_HEADERS)
    if (name === 'Projects') sh.appendRow(PROJECT_HEADERS)
    if (name === 'Intakes')       sh.appendRow(INTAKE_HEADERS)
    if (name === 'ClientIntakes') sh.appendRow(CLIENT_INTAKE_HEADERS)
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff')
    sh.setFrozenRows(1)
  }
  return sh
}

function makeId(prefix) {
  return prefix + '-' + new Date().getTime().toString(36).toUpperCase()
}

function now() {
  return Utilities.formatDate(new Date(), 'Europe/Paris', 'dd/MM/yyyy HH:mm')
}

function cors(output) {
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
}

// ── doGet — backward compat with existing Lightsofter form ───────────────────
// Also handles: ?action=getLeads, ?action=getProjects

function doGet(e) {
  var p = e.parameter || {}
  var action = p.action || ''

  try {
    // ── READ actions ──────────────────────────────────────────────────────────
    if (action === 'getLeads') {
      var rows = getSheet('Leads').getDataRange().getValues()
      var headers = rows[0]
      var data = rows.slice(1).map(function(r) {
        var obj = {}
        headers.forEach(function(h, i) { obj[h] = r[i] })
        return obj
      })
      return cors(JSON.stringify({ ok: true, data: data }))
    }

    if (action === 'getProjects') {
      var rows2 = getSheet('Projects').getDataRange().getValues()
      var headers2 = rows2[0]
      var data2 = rows2.slice(1).map(function(r) {
        var obj = {}
        headers2.forEach(function(h, i) { obj[h] = r[i] })
        return obj
      })
      return cors(JSON.stringify({ ok: true, data: data2 }))
    }

    // ── Legacy Lightsofter form submit (GET with params) ──────────────────────
    if (p.name || p.email) {
      var sh = getSheet('Leads')
      var phone = p.phone || '—'
      var waLink = phone !== '—'
        ? 'https://wa.me/33' + phone.replace(/\D/g,'').replace(/^0/,'')
        : '—'

      sh.appendRow([
        makeId('LS'),
        p.date || now(),
        'Lightsofter',
        p.name || '—',
        phone,
        p.email || '—',
        '—',
        p.type || p.sector || '—',
        'Nouveau',
        p.message || '—',
        waLink,
      ])
      return cors(JSON.stringify({ ok: true }))
    }

    return cors(JSON.stringify({ ok: true, message: 'CRM ready' }))

  } catch(err) {
    return cors(JSON.stringify({ ok: false, error: err.toString() }))
  }
}

// ── doPost — add leads, update status, manage projects ───────────────────────

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}')
    var action = body.action || 'addLead'

    // ── ADD LEAD (MonSalonVip + Lightsofter) ──────────────────────────────────
    if (action === 'addLead') {
      var sh = getSheet('Leads')
      var phone = body.phone || '—'
      var waLink = phone !== '—'
        ? 'https://wa.me/33' + phone.replace(/\D/g,'').replace(/^0/,'')
        : '—'

      sh.appendRow([
        makeId(body.source === 'MonSalonVip' ? 'MSV' : 'LS'),
        now(),
        body.source || 'Lightsofter',
        body.name || '—',
        phone,
        body.business || body.salon || body.company || '—',
        body.city || '—',
        body.sector || body.projectType || '—',
        'Nouveau',
        body.notes || body.message || '—',
        waLink,
      ])
      return cors(JSON.stringify({ ok: true }))
    }

    // ── UPDATE LEAD STATUS ────────────────────────────────────────────────────
    if (action === 'updateLead') {
      var sh2 = getSheet('Leads')
      var rows = sh2.getDataRange().getValues()
      var headers = rows[0]
      var idCol = headers.indexOf('ID')
      var statusCol = headers.indexOf('Statut')
      var notesCol = headers.indexOf('Notes')

      for (var i = 1; i < rows.length; i++) {
        if (rows[i][idCol] === body.id) {
          if (body.status)  sh2.getRange(i + 1, statusCol + 1).setValue(body.status)
          if (body.notes)   sh2.getRange(i + 1, notesCol + 1).setValue(body.notes)
          return cors(JSON.stringify({ ok: true }))
        }
      }
      return cors(JSON.stringify({ ok: false, error: 'Lead not found' }))
    }

    // ── ADD PROJECT ───────────────────────────────────────────────────────────
    if (action === 'addProject') {
      var sh3 = getSheet('Projects')
      sh3.appendRow([
        makeId('PRJ'),
        now(),
        body.client || '—',
        body.business || '—',
        body.type || 'Site vitrine',
        body.status || 'Brief',
        body.price || '490',
        body.startDate || now(),
        body.dueDate || '—',
        body.url || '—',
        body.notes || '—',
      ])
      return cors(JSON.stringify({ ok: true }))
    }

    // ── UPDATE PROJECT ────────────────────────────────────────────────────────
    if (action === 'updateProject') {
      var sh4 = getSheet('Projects')
      var rows4 = sh4.getDataRange().getValues()
      var headers4 = rows4[0]
      var idCol4 = headers4.indexOf('ID')

      for (var j = 1; j < rows4.length; j++) {
        if (rows4[j][idCol4] === body.id) {
          if (body.status) sh4.getRange(j + 1, headers4.indexOf('Statut') + 1).setValue(body.status)
          if (body.url)    sh4.getRange(j + 1, headers4.indexOf('URL') + 1).setValue(body.url)
          if (body.notes)  sh4.getRange(j + 1, headers4.indexOf('Notes') + 1).setValue(body.notes)
          if (body.price)  sh4.getRange(j + 1, headers4.indexOf('Prix (€)') + 1).setValue(body.price)
          return cors(JSON.stringify({ ok: true }))
        }
      }
      return cors(JSON.stringify({ ok: false, error: 'Project not found' }))
    }

    // ── ADD INTAKE (MonSalonVip client onboarding) ────────────────────────────
    if (action === 'addIntake') {
      var shi = getSheet('Intakes')
      var waI = (body.whatsapp || body.phone || '').replace(/\D/g,'').replace(/^0/,'')
      shi.appendRow([
        makeId('INT'),
        now(),
        body.salonName || '—',
        body.ownerName || '—',
        body.city || '—',
        body.phone || '—',
        waI ? 'https://wa.me/33' + waI : '—',
        body.email || '—',
        body.sector || '—',
        body.palette || '—',
        body.style || '—',
        body.booking || '—',
        body.bookingLink || '—',
        body.hasPhotos || '—',
        body.hasLogo || '—',
        body.services || '—',
        body.openingHours || '—',
        body.aboutText || '—',
        body.extraNote || '—',
        body.instagram || '—',
        body.googleMaps || '—',
      ])
      return cors(JSON.stringify({ ok: true }))
    }

    // ── ADD CLIENT INTAKE (Lightsofter web project brief) ─────────────────────
    if (action === 'addClientIntake') {
      var shci = getSheet('ClientIntakes')
      shci.appendRow([
        makeId('CI'),
        now(),
        body.source || 'Lightsofter',
        body.ownerName || '—',
        body.company || '—',
        body.sector || '—',
        body.city || '—',
        body.phone || '—',
        body.email || '—',
        body.existingUrl || '—',
        body.projectType || '—',
        body.projectDesc || '—',
        body.budget || '—',
        body.deadline || '—',
        body.palette || '—',
        body.style || '—',
        body.hasLogo || '—',
        body.hasPhotos || '—',
        body.services || '—',
        body.aboutText || '—',
        body.domain || '—',
        body.instagram || '—',
        body.facebook || '—',
        body.linkedin || '—',
        body.googleMaps || '—',
        body.extraNote || '—',
      ])
      return cors(JSON.stringify({ ok: true }))
    }

    return cors(JSON.stringify({ ok: false, error: 'Unknown action: ' + action }))

  } catch(err) {
    return cors(JSON.stringify({ ok: false, error: err.toString() }))
  }
}
