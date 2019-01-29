const sqlite3 = require('sqlite3').verbose()
require('date-utils')

exports.saveMsg = (ip, name, msg) => {
  const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Connected!')
  })

  let date = new Date()
  let dateStr = date.toFormat('YYYY-MM-DD HH24:MI:SS.000')
  let query = `INSERT INTO messages(created_at, ip, name, msg) VALUES(?, ?, ?, ?)`
  db.run(query, [dateStr, ip, name, msg], (err) => {
    if (err) {
      return console.log(err.message)
    }
    console.log(`Saved msg`)
  })

  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Close...')
  })
}

exports.selectMsg = () => {
  const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Connected!')
  })
  db.all(
    'SELECT created_at, name, msg FROM messages ORDER BY id LIMIT 20',
    (err, row) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('select')

      return row
        ? console.log(row)
        : console.log(`No playlist found with the id `)
    }
  )

  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Close...')
  })
}

exports.initDB = () => {
  const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Connected!')
  })

  db.serialize(() => {
    let create = new Promise((resolve, reject) => {
      db.get(
        'select count(*) from sqlite_master where type="table" and name=$name',
        { $name: 'messages' },
        (err, res) => {
          if (err) {
            return console.error(err.message)
          }
          var exists = false
          if (res['count(*)'] > 0) {
            exists = true
          }

          resolve(exists)
        }
      )
    })

    create.then((exists) => {
      if (!exists) {
        db.run(
          'CREATE TABLE messages([id] [integer] PRIMARY KEY AUTOINCREMENT NOT NULL, [created_at] [datetime] NOT NULL, ip, name, msg)',
          (err) => {
            if (err) {
              return console.log(err.message)
            }
            console.log('Create table')
          }
        )
      }
    })

    create.then(() => {
      db.close((err) => {
        if (err) {
          return console.error(err.message)
        }
        console.log('Close...')
      })
    })
  })
}
