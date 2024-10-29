import sqlite3 from 'sqlite3'

const _db = new sqlite3.Database('./game.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message)
  } else {
    console.log('Connected to the SQLite database.')
    // get empty Player
    //player = new playerObj.Player(0, 'newPlayer', 100, 0, 'none', 'Grasslands', 'Foothills', 0);
    //const serializedObject = JSON.stringify(player);
    _db.run('CREATE TABLE IF NOT EXISTS playerData (userId TEXT PRIMARY KEY, pdata BLOB)')
  }
})

export const db = _db

export const get = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(query, [userId], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}
