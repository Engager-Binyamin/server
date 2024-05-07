//====================== Schedule Demo ====================
router.post('/schedule', (req, res) => {
    try {
      const dateData = req.body.datetime
      const formattedData = new Date(dateData)
      const placeHolderFunc = () => {
        console.log("executed", new Date());
      }
      scheduleService.convertToDateAndExec(formattedData, placeHolderFunc)
      res.send(console.log("msg scheduled"))
    } catch (error) {
      res.status(500).send("error occured", console.log(error))
    }
  })
  
  router.put('/schedule', (req, res) => {
    try {
  
      scheduleService.cancelScheduledTask()
      res.send("scheduled task cancelled successfully")
    } catch (error) {
      res.status(500).send("problem occured")
    }
  })