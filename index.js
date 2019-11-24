class BruteForce {
    constructor(min, max, nbr) {
        this.chars = [
            '0', '1', '2', '3', '4', '5', '6','7', '8', '9', 
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'É', 'é', 'Á', 'á', 'Ú', 'ú', 'Í', 'í', 'Ó', 'ó', 'È', 'è', 'À', 'à', 'Ù', 'ù', 'Ì', 'ì', 'Ò', 'ò', 'Ü', 'ü', 'Ö', 'ö', 'Ä', 'ä', 
            '°', '!', '"', '§', '$', '%', '&', '/', '(', ')', '=', '?', '`', '´', '\\', '}', ']', '[', '{', '³', '²', '^', '+', '*', '~', '#', '\'', '-', '_', ';', ',', '.', ':', 'µ', '@', '€', '|', '<', '>', '"'
        ];
        this.min = min;
        this.max = max;
        this.nbr = nbr;
    }

    bruteForce() {
        var i = 3 ; // Size of the password
        var j = 0 ;
        while (i <= 4) { // Index `i` starts at 3, max value is 20.
            j = 0 ;
            var result = new Array(i) ;
            while (j < result.length) { // Init the first combination
                result[j] = this.chars[0] ;
                j++;
            }
            this.recursive(result, i, i - 1)
            i++ ;
        }
    }

    recursive(array, arrayLength, cell) {
        this.cellLoop(array, cell);
        if (cell == 0)
            return ;
        else
            this.recursive(array, arrayLength, cell - 1) ;
    }

    cellLoop(array, cell) {
        var i = 0;
        while (i < this.chars.length) {
            array[cell] = this.chars[i] ;
            console.log(array.join("") + '\n');
            if (cell != array.length - 1) {
                var j = array.length - 1 ;
                while (j != cell) {
                    this.cellLoop(array, j) ;
                    j-- ;
                }
            }
            i++;
        }
    }
}

mdp = new BruteForce(3, 20, 200).bruteForce()