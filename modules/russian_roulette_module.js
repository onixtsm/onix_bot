let barrel
let bullet

shuffle = () => {



        barrel = [false, false, false, true, false, false]
        bullet = barrel.length

        for (let i = barrel.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [barrel[i], barrel[j]] = [barrel[j], barrel[i]];
        }
}

shot = () => {
        if (bullet < 1 || !bullet) {
                return -1
        }
        bullet--

        return barrel[bullet]
}


module.exports = {
        shuffle,
        shot
}
