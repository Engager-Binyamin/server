const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { mwToken } = require("../middlewares/auth");
const { getOneCamp } = require("../BL/campaign.service");
const { addLeadToCamp } = require("../BL/lead.service");
const { convertLeadsToExcelFormat, convertDataToBuffer, convertExcelToLeads } = require("../BL/excel.service");


// download leads in excel format per campaign
router.get("/download/leads/:campaignId", mwToken, async (req, res) => {
  try {
    const campaign = await getOneCamp(req.params.campaignId);
    if (!campaign) throw { code: 404, msg: "Campaign is not exist" };

    const data = convertLeadsToExcelFormat(campaign.leads);
    const excelBuffer = convertDataToBuffer(data)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(`leads-${campaign.title}.xlsx`)}`);

    res.send(excelBuffer);
  } catch (err) {
    console.log({ err });
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
});

// download leads in excel format from list of leads from the client
router.post("/download/leads", mwToken, async (req, res) => {
  try {
    const data = convertLeadsToExcelFormat(req.body);
    const excelBuffer = convertDataToBuffer(data)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(`leads.xlsx`)}`);
    
    res.send(excelBuffer);
  } catch (err) {
    console.log({ err });
    res.status(err.code || 500).send({ msg: err.msg || "something went wrong" });
  }
});

// upload/leads - add leads to campaign from excel 
router.post('/upload/leads/:campaignId', upload.single('file'), mwToken, async (req, res) => {
  try {
    if (!req.file) throw ({ code: 400, msg: 'No file uploaded' });
    const excelBuffer = req.file.buffer;
    const leads = await convertExcelToLeads(excelBuffer);
    await Promise.all(leads.map((lead) => addLeadToCamp(req.params.campaignId, req.body?.user?._id, lead)));
    res.send({ msg: 'Leads uploaded successfully' });
  } catch (err) {
    console.log({ err });
    res.status(err.code || 500).send({ msg: err.msg || 'Something went wrong' });
  }
});

module.exports = router;