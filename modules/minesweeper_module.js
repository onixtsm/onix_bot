let IField = () => {
  return {
    NUMBER: 0,
    HIDDEN: true,
    MINE: false
  }
}

let fill = (f) => {
 for (let i = 0; i < f.length; i++) {
    for (let j = 0; j < f.length; j++) {
      f[i][j] = IField()
    }
  }

  return f
}

const Generate = (level) => {
 
  let side = level[0]
  let mine_count = level[1]
  let field = Array.from(Array(side), () => new Array(side))
 
  field = fill(field)

  for (let i = 0; i < mine_count;) {
    let x = Math.floor(Math.random() * side)
    let y = Math.floor(Math.random() * side)

    if (!field[x][y].MINE) {
      field[x][y].MINE = true 
      i++
    }

    
  }


  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++ ) {
      if (field[i][j].MINE) continue

      let xi
      let yj

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {

          if (x !== 0 || y !== 0) {
            xi = i + x
            yj = j + y
            if ((0 <= xi && xi < side) && (0 <= yj && yj < side)) {
              if (field[xi][yj].MINE) {
                field[i][j].NUMBER++
              }
            }
          }
        }
      }

    }
  }
 

  return field
}



module.exports = {
  Generate
}
