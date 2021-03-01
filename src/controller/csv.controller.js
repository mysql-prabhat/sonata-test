const db = require("../models/");
const Candidate = db.candidateSummary;

const fs = require("fs");
const csv = require("fast-csv");
const { resolve } = require("path");
const { rejects } = require("assert");

//This function is used to upload csv and import fields data to database
const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }
    
    let candidate = [];
    let path = __basedir + "/static/uploads/" + req.file.filename;
    
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {console.log('test3',error);
        throw error.message;
      })
      .on("data", (row) => {
        //csv data importing to this variable
        let candidates_data = [];
        //each data inserted into the variable for future use
        candidates_data.push({'ctc':{'value':row.CTC,'ctcUnit':row['CTC Type'],'ctcCurrency':row['CTC currency']},'candidateExperience':row['Experience(Years)'],'company':{'name':row['Company Name']},'location':{'city':row.Location},'linkedIn':row['LinkedIn Link']});
        candidate.push({'name':row.Name,'email_id':row['Email ID'],'phone_number':row['Contact Number'],'candidates_data':candidates_data,'created_date':new Date(),'created_by':'Prabhat Mandal','modified_by':''});
        
      })
      .on("end", async () => {
        //let Candidate = db.Candidate;
        //Checking the data validation
        const validationError = await validateCsvData(candidate);
        if (validationError) {
          return res.status(403).json({ error: validationError });
        }
        //Inserting bulk data to the table
        Candidate.bulkCreate(candidate)
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getcandidate = (req, res) => {
  Candidate.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving candidate.",
      });
    });
};

//This function is used to validate the csv data
validateCsvData = async function (rows) {
  const dataRows = rows;
  for (let i = 0; i < dataRows.length; i++) {
    const rowError = await validateCsvRow(dataRows[i]);
    console.log('rowError',rowError);
    if (rowError) {
      return `${rowError} on row ${i + 1}`
    }
  }
  return;
};

//Here all the datatype and blank validation done
validateCsvRow = async function (row) {
  
  //Checking for duplicate data exist or not
  let dup_data = await checkDuplicate(row);
  if(dup_data)
  {
    return 'User with email , name and phone number already exist'
  }
  else if (!row.name && row.name.length<90) {
    return "invalid name"
  }
  else if(ValidateEmail(row.email_id) && !row.email_id){
    return "invalid email_id"
  }
  else if (!row.phone_number && row.phone_number.length<99) {
    return "invalid Contact Number"
  }
  
  return;
};
// checking here for the duplicate data
checkDuplicate = function(row)
{
    return new Promise((resolve,rejects)=>
    {
      Candidate.findOne({ where: {'email_id':row.email_id,'name':row.name,'phone_number':row.phone_number}})
      .then((data)=>{
        if(data != null)
        {
          return resolve(1);
        }
        else{
          return resolve(0);
        }
      })
      .catch((err)=>
      {
        return rejects(0);
      })
    });
}

//Validating the email
ValidateEmail = function (mail) 
{
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(mail.match(mailformat))
  {
    return (true)
  }
    
  return (false)
}

module.exports = {
  upload,
  getcandidate
};
