let selected_words_div = document.getElementById('selected_word_div');
let word_input = document.getElementById('word_input');
let create_button = document.getElementById('create');
let difficulty_level_input = document.getElementById('difficulty_level');
let add_word_button = document.getElementById('add_word_button');
let x_size_input = document.getElementById('x_size');
let y_size_input = document.getElementById('y_size');
let grid_table = document.getElementById('grid_table');
let words = Array();
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let grid = new Array;
let words_in_grid = new Array;

/**
 * Schwierigkeitsstufen:
 * 
 * 1. Normal:
 *  alles normal
 * 
 * 2. Schwer:
 * +
 * 
 * 3. Sehr Schwer
 * + Strukture der Wörter reinmischen --> similar_strings
 * + Mehr reserved Strings
 * 
 * 
*/


function add_word()
{
    let word = word_input.value;
    word_input.value = "";
    words.push(word);
    console.log(words);
    show_word(word);
}

function show_word(word)
{
    let text = document.createTextNode(word);
    let p = document.createElement("p");
    p.appendChild(text);
    selected_words_div.appendChild(p);
}




class wordGrid 
{
    constructor()
    {
        this.grid = new Array;
        this.word_in_grid = new Array;
    }

    create_word_grid()
    {
        let x = x_size_input.value;
        let y = y_size_input.value;
        this.fill_spaces(x, y);
        this.handle_difficulty_level3(x, y);
        this.insert_words(x, y, true, words);
        console.log(grid);
        this.print_grid();
    } 

    insert_words(x, y, save, array_with_words)
    {
        let word_array = array_with_words;
        for(let j = 0; j < word_array.length; j++)
        {
            let rand_int = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
            for(let i = 0; i < 1000;i++)
            {
                let rand_int2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1;        
                if(rand_int2 == 1)
                {
                    word_array[j] = this.reverse(word_array[j]);
                }

                if(rand_int == 1)
                {
                    if(this.insert_horizontal(word_array[j], x, y, save) != false)
                    {
                        break;
                    }
                }
                if(rand_int == 2)
                {
                    if(this.insert_vertical(word_array[j], x, y, save) != false)
                    {
                        break;
                    }
                }
                if(rand_int == 3)
                {
                    if(this.insert_diagonal(word_array[j], x, y, save) != false)
                    {
                        break;
                    }
                }
            } 
        }
    }

    reverse(string){
        return string.split("").reverse().join("");
    }

    insert_diagonal(word, x, y, save)
    {
        let y_last_pos = y - word.length;
        let x_last_pos = x - word.length;
        let y_pos = Math.floor(Math.random() * (y_last_pos - 1 + 1)) + 1;
        let x_pos = Math.floor(Math.random() * (x_last_pos - 1 + 1)) + 1;
        for(let l = x_pos, i = y_pos, k = 0; k < word.length; i++, l++, k++)
        {
            if(words_in_grid[l][i] == 1)
            {
                return false;
            }
        }
        for(let l = x_pos, i = y_pos, k = 0; k < word.length; i++, l++, k++)
        {
            grid[l][i] = word[k];
            if(save == true)
            {
                words_in_grid[l][i] = 1;
            }
        }
    }

    insert_vertical(word, x, y, save)
    {
        let y_last_pos = y - word.length;
        let y_pos = Math.floor(Math.random() * (y_last_pos - 1 + 1)) + 1;
        let x_pos = Math.floor(Math.random() * (x - 1 + 1)) + 1;
        for(let i = y_pos, k = 0; k < word.length; i++, k++)
        {
            if(words_in_grid[x_pos][i] == 1)
            {
                return false;
            }
        }
        for(let i = y_pos, k = 0; k < word.length; i++, k++)
        {
            grid[x_pos][i] = word[k];
            if(save == true)
            {
                words_in_grid[x_pos][i] = 1;
            }
            
        }
    }

    insert_horizontal(word, x, y, save)
    {
        let x_last_pos = x - word.length;
        let x_pos = Math.floor(Math.random() * (x_last_pos - 1 + 1)) + 1;
        let y_pos = Math.floor(Math.random() * (y - 1 + 1)) + 1;
        for(let i = x_pos, k = 0; k < word.length; i++, k++)
        {
            if(words_in_grid[i][y_pos] == 1)
            {
                return false;
            }
        }
        for(let i = x_pos, k = 0; k < word.length; i++, k++)
        {
            grid[i][y_pos] = word[k];
            if(save == true)
            {
                words_in_grid[i][y_pos] = 1;
            }            
        }
    }


    fill_spaces(x, y)
    {
        for(let k = 1; k <= x; k++)
        {
            grid[k] = new Array();
            words_in_grid[k] = new Array();
            for(let i = 1; i <= y; i++)
            {
                grid[k][i] = this.random_letter();
                words_in_grid[k][i] = 0;
            }
        }
    }

    random_letter()
    {
        let rand_int = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
        let letter = letters[rand_int];
        return letter;  
    }

    print_grid()
    {
        for(let i = 1; i < grid.length; i++)
        {
            let tr = document.createElement("tr");
            let length = grid[i].length;
            for(let k = 1; k < length; k++)
            {
                let td_letter = document.createTextNode(grid[i][k]);
                let td = document.createElement("td");
                td.appendChild(td_letter);
                tr.appendChild(td);
            }
            grid_table.appendChild(tr);
        }
        console.log(words_in_grid);
    }

    //methods for difficulty level3
    handle_difficulty_level3(x, y)
    {
        if(difficulty_level_input.value == 3)
        {
            let similar_words = [];
            for(let j = 0; j < words.length; j++)
            {
                similar_words = this.cretae_similar_strings(words[j], similar_words);
            }
            console.log("similiar words:");
            console.log(similar_words);
            this.insert_words(x, y, false, similar_words);
        }
    }

    cretae_similar_strings(word, similar_words)
    {
        if(word.length > 3)
        {
            let index1 = Math.floor(word.length * 2 / 3);
            let index2 = Math.floor(word.length / 3);
            let index3 = Math.floor(word.length * 1 / 3);
            similar_words.push(word.slice(0, index1));
            similar_words.push(word.slice(0, index1));
            similar_words.push(word.slice(0, index3));
            similar_words.push(word.slice(0, index3));
            similar_words.push(word.slice(index2));
            similar_words.push(word.slice(index2));
            return similar_words;
        }
        return false;
    }

}

let word_grid = new wordGrid();

function init_eventlisteners()
{
    add_word_button.addEventListener('click', add_word);
    create_button.addEventListener('click', () => {word_grid.create_word_grid()})
}

document.addEventListener("DOMContentLoaded", init_eventlisteners);