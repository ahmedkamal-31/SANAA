import fs from 'fs'
import path from 'path'
const dbPath = path.join(process.cwd(),'db.json')

export default function handler(req,res){
  const db = JSON.parse(fs.readFileSync(dbPath))
  if(req.method==='GET'){
    res.status(200).json(db.bookings)
  } else if(req.method==='POST'){
    const body = req.body
    const id = Date.now()
    const item = {id, date: new Date().toLocaleString(), ...body}
    db.bookings.unshift(item)
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
    res.status(201).json(item)
  } else {
    res.status(405).end()
  }
}
