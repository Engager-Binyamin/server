const xlsx = require('xlsx');

// convert extra object in excel format as "Extra חוג: value"
 const convertExtra = ([key, value]) =>
  [`Extra ${value?.he || key}`, typeof value === 'object' ? value?.value : String(value)]

 const convertDataToBuffer = (data) => {
  // Create a new workbook and worksheet
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  // Add the worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads');
  // Generate the Excel file buffer
  const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return excelBuffer
}

// convert leads array in mongoose format to excel format
 const convertLeadsToExcelFormat = (leads) => leads.map((lead) => ({
  'שם מלא': lead.fullName || lead.name,
  'מייל': lead.email,
  'טלפון': lead.phone,
  'הודעות': lead.notes,
  'תאריך הצטרפות': (typeof lead.joinDate === 'string' ? new Date(lead.joinDate) : lead.joinDate).toISOString().slice(0, 10),
  'פעיל': Boolean(lead.isActive) ? 'כן' : 'לא',
  ...Object.fromEntries(
    Object.entries(
      typeof lead.extra === 'object' ? lead.extra : JSON.parse(lead.extra || '{}')
    ).map(convertExtra)
  ),
}));

// convert excel to leads array in mongoose format 
// important - fields must be in the same order as in the excel and in hebrew
 const convertExcelToLeads = async (excelBuffer) => {
   try {
     const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
     const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
     const headers = data.shift();
 
     const leads = data.map(row => {
       const lead = {};
 
       headers.forEach((header, index) => {
         switch (header) {
           case 'שם מלא':
             lead.fullName = row[index];
             break;
           case 'מייל':
             lead.email = row[index];
             break;
           case 'טלפון':
             lead.phone = row[index];
             break;
           case 'הודעות':
             lead.notes = row[index];
             break;
           case 'תאריך הצטרפות':
             lead.joinDate = new Date(row[index]);
             break;
 
           default:
             if (header.startsWith('Extra ')) {
               const key = header.slice(6);
               const value = row[index];
               lead.extra = { ...lead.extra, [key]: { he: key, value } };
             }
         }
       });
       return lead;
     }).filter(l => l['phone']);
 
     return leads;
   } catch (err) {
     console.error('Error converting Excel to leads:', err);
     throw err;
   }
};
 
module.exports = { convertDataToBuffer, convertLeadsToExcelFormat, convertExcelToLeads, convertExtra };